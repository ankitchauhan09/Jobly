package com.sih.notificationservice.controller;

import com.sih.notificationservice.payload.NotificationPayload;
import com.sih.notificationservice.service.KafkaReactiveService;
import com.sih.notificationservice.util.AppConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;

@RestController
@RequestMapping("/sse/notifications")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(
        origins = {"http://localhost:5500", "http://127.0.0.1:5500", "http://localhost:5173"},
        allowCredentials = "true",
        methods = {RequestMethod.GET, RequestMethod.OPTIONS}
)
public class NotificationController {

    private final KafkaReactiveService kafkaReactiveService;

    @GetMapping(value = "/{topic}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<NotificationPayload>> streamNotifications(@PathVariable String topic) {
        return kafkaReactiveService.subscribeToTopic(topic)
                .map(this::convertToServerSentEvent)
                .onErrorResume(this::handleStreamError);
    }

    @GetMapping(value = "/all", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<NotificationPayload>> allNotifications() {
        return kafkaReactiveService.subscribeToTopics(AppConstants.ALL_TOPICS)
                .map(this::convertToServerSentEvent)
                .onErrorResume(this::handleStreamError);
    }

    /**
     * Convert notification to ServerSentEvent
     * @param message Notification payload
     * @return ServerSentEvent
     */
    private ServerSentEvent<NotificationPayload> convertToServerSentEvent(NotificationPayload message) {
        return ServerSentEvent.<NotificationPayload>builder()
                .id(String.valueOf(Instant.now().toEpochMilli()))
                .event("message")
                .data(message)
                .build();
    }

    /**
     * Handle stream errors gracefully
     * @param throwable Error that occurred
     * @return Fallback flux with error event
     */
    private Flux<ServerSentEvent<NotificationPayload>> handleStreamError(Throwable throwable) {
        log.error("Error in notification stream", throwable);

        // Create an error notification
        return Flux.just(
                ServerSentEvent.<NotificationPayload>builder()
                        .event("error")
                        .data(NotificationPayload.builder()
                                .title("Notification Error")
                                .message("Unable to retrieve notifications")
                                .build())
                        .build()
        );
    }
}