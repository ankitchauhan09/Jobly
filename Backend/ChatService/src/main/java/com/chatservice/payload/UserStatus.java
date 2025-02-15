package com.chatservice.payload;

import lombok.Data;

@Data
public class UserStatus {
    private String userId;
    private Boolean isOnline;
}
