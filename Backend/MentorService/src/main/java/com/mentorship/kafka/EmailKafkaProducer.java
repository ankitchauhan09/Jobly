package com.mentorship.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mentorship.payload.KafkaEmailTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@Slf4j
public class EmailKafkaProducer {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${apache.kafka.topics.email-topic}")
    private String kafkaEmailTopicName;

    public void sendEmail(KafkaEmailTemplate template) {
        try {
            String stringifyTemplate = objectMapper.writeValueAsString(template);
            kafkaTemplate.send("email-instant", stringifyTemplate);
        } catch (IOException e) {
            log.error("Error occurred while converting the KafkaEmailTemplate to string : {}", e.getMessage());
        }
    }

    public void sendScheduledEmail(KafkaEmailTemplate template) {
        try{
            String stringifyTemplate = objectMapper.writeValueAsString(template);
            kafkaTemplate.send("email-scheduled", stringifyTemplate);
        } catch (IOException e) {
            log.error("Error occurred while converting the KafkaEmailTemplate to string : {}", e.getMessage());
        }
    }
}
