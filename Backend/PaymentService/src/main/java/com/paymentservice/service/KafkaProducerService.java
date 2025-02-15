package com.paymentservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.paymentservice.payload.NotificationPayload;
import com.paymentservice.payload.PaymentLogDetail;
import com.paymentservice.utils.AppConstants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Random;
import java.util.UUID;

@Service
@Slf4j
public class KafkaProducerService {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    public Mono<Boolean> sendPaymentLogToKafka(PaymentLogDetail paymentLogDetail) {
        try {
            NotificationPayload notificationPayload = NotificationPayload.builder()
                    .id(Instant.now().toEpochMilli())
                    .read(false)
                    .title("Payment Received")
                    .type("success")
                    .message("Payment of Rs." + paymentLogDetail.getAmount() + " done successfully...")
                    .build();
            String stringifyPaymentLog = objectMapper.writeValueAsString(notificationPayload);
            kafkaTemplate.send(AppConstants.PAYMENT_LOG_TOPIC, stringifyPaymentLog);
            return Mono.just(true);
        } catch (Exception e) {
            e.printStackTrace();
            return Mono.just(false);
        }
    }

}
