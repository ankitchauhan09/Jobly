package com.chatservice.controller;

import com.chatservice.config.repository.ChatRepo;
import com.chatservice.payload.Message;
import com.chatservice.payload.UserStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import reactor.core.publisher.Flux;

import java.io.IOException;

@Controller
@Slf4j
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @MessageMapping("/chat/private")
    public void sendMessages(@Payload Message message) {
        log.info("message received : {}", message);
        streamChatsToKafkaForStoringInDb(message);
        messagingTemplate.convertAndSendToUser(message.getReceiverId(), "/chat/private", message);
    }

    @MessageMapping("/online-status")
    public void updateOnlineStatus(@Payload UserStatus userStatus) {
        messagingTemplate.convertAndSendToUser(userStatus.getUserId(), "/online-status", userStatus);
    }

    private void streamChatsToKafkaForStoringInDb(Message message) {
        try {
            String stringifyChat = objectMapper.writeValueAsString(message);
            kafkaTemplate.send("chat-messages", stringifyChat);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
