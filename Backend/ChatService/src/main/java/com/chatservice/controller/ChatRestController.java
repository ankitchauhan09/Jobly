package com.chatservice.controller;

import com.chatservice.config.repository.ChatRepo;
import com.chatservice.payload.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/chats")
public class ChatRestController {

    @Autowired
    private ChatRepo chatRepo;

    @GetMapping("/all/{senderId}/{receiverId}")
    public Flux<Message> getAllChatMessages(@PathVariable("receiverId") String receiverId, @PathVariable("senderId") String senderId) {
        return chatRepo.findAllMessages(senderId, receiverId);
    }

}
