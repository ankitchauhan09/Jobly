package com.sih.notificationservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sih.notificationservice.payload.NotificationPayload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;
import reactor.core.scheduler.Schedulers;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;
import reactor.kafka.receiver.ReceiverRecord;

import java.time.Duration;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
@RequiredArgsConstructor
public class KafkaReactiveService {
    private final ConcurrentHashMap<String, TopicSubscription> topicSubscriptions = new ConcurrentHashMap<>();
    private final ReceiverOptions<String, String> receiverOptions;
    private final ObjectMapper objectMapper;

    // Configurable parameters with more conservative defaults
    private static final int MAX_CONCURRENT_SUBSCRIPTIONS = 50;
    private static final Duration SUBSCRIPTION_TIMEOUT = Duration.ofSeconds(60);
    private static final int BACKPRESSURE_BUFFER_SIZE = 128;

    /**
     * Subscribe to a specific topic with improved error handling
     * @param topic Kafka topic to subscribe to
     * @return Flux of NotificationPayload
     */
    public Flux<NotificationPayload> subscribeToTopic(String topic) {
        return topicSubscriptions.computeIfAbsent(topic, this::createTopicSubscription)
                .getFlux()
                .onErrorResume(this::handleSubscriptionError);
    }

    /**
     * Subscribe to multiple topics with improved error handling
     * @param topics Set of Kafka topics to subscribe to
     * @return Flux of NotificationPayload from all topics
     */
    public Flux<NotificationPayload> subscribeToTopics(Set<String> topics) {
        return Flux.fromIterable(topics)
                .flatMap(this::subscribeToTopic, MAX_CONCURRENT_SUBSCRIPTIONS) // Limit concurrency
                .onBackpressureBuffer(
                        BACKPRESSURE_BUFFER_SIZE,
                        dropped -> log.warn("Dropped notification due to backpressure")
                );
    }

    /**
     * Handle subscription errors gracefully
     * @param throwable Error that occurred during subscription
     * @return Fallback Flux or rethrow
     */
    private Flux<NotificationPayload> handleSubscriptionError(Throwable throwable) {
        log.error("Subscription error occurred", throwable);

        // Return an empty flux or a default notification
        return Flux.empty();
    }

    /**
     * Create a new TopicSubscription with advanced configuration
     * @param topic Kafka topic
     * @return TopicSubscription
     */
    private TopicSubscription createTopicSubscription(String topic) {
        return new TopicSubscription(topic);
    }

    /**
     * Internal class to manage topic-specific subscriptions
     */
    private class TopicSubscription {
        private final String topic;
        private final Sinks.Many<NotificationPayload> sink;
        private final Flux<NotificationPayload> flux;

        public TopicSubscription(String topic) {
            this.topic = topic;

            // Create a sink with overflow strategy
            this.sink = Sinks.many().multicast().onBackpressureBuffer(
                    BACKPRESSURE_BUFFER_SIZE,
                    false
            );

            // Create a shared, resilient flux
            this.flux = this.sink.asFlux()
                    .publishOn(Schedulers.parallel())
                    .transform(this::addErrorHandling)
                    .share();

            // Start Kafka listener
            startKafkaListener();
        }

        /**
         * Add additional error handling to the flux
         * @param flux Input flux
         * @return Transformed flux with error handling
         */
        private Flux<NotificationPayload> addErrorHandling(Flux<NotificationPayload> flux) {
            return flux
                    .onErrorContinue((throwable, obj) -> {
                        log.error("Error processing notification", throwable);
                    })
                    .timeout(
                            SUBSCRIPTION_TIMEOUT,
                            Flux.empty()
                    );


        }

        /**
         * Start Kafka listener for the specific topic
         */
        private void startKafkaListener() {
            KafkaReceiver.create(   receiverOptions.subscription(Set.of(topic)))
                    .receive()
                    .publishOn(Schedulers.parallel())
                    .doOnNext(this::processRecord)
                    .doOnError(this::handleListenerError)
                    .retry() // Add retry mechanism
                    .subscribe();
        }

        /**
         * Process incoming Kafka record
         * @param record Kafka receiver record
         */
        private void processRecord(ReceiverRecord<String, String> record) {
            try {
                NotificationPayload payload = mapToNotificationPayload(record);
                if (payload != null) {
                    // Non-blocking emit with overflow strategy
                    Sinks.EmitResult result = sink.tryEmitNext(payload);

                    // Log if emission fails
                    if (result != Sinks.EmitResult.OK) {
                        log.warn("Failed to emit notification for topic {}: {}", topic, result);
                    }
                }
            } catch (Exception e) {
                log.error("Error processing record for topic {}", topic, e);
            }
        }

        /**
         * Handle errors in Kafka listener
         * @param error Exception occurred
         */
        private void handleListenerError(Throwable error) {
            log.error("Critical error in Kafka listener for topic {}", topic, error);
            sink.tryEmitError(error);
        }

        /**.timeout(SUBSCRIPTION_TIMEOUT, Flux.empty())
         * Get the flux for external subscription
         * @return Flux of NotificationPayload
         */
        public Flux<NotificationPayload> getFlux() {
            return flux;
        }

        /**
         * Map Kafka record to NotificationPayload
         * @param record Kafka receiver record
         * @return Mapped NotificationPayload
         */
        private NotificationPayload mapToNotificationPayload(ReceiverRecord<String, String> record) {
            try {
                log.info("message  : {}", record.value());
                return objectMapper.readValue(record.value(), NotificationPayload.class);
            } catch (Exception e) {
                log.error("Error mapping notification payload", e);
                return null;
            }
        }
    }
}