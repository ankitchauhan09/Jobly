package com.chatservice.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageDto {

    private String messageId;
    private String senderId;
    private String senderName;
    private String receiverId;
    private String receiverName;
    private LocalDateTime timestamp;
    private String content;

}
