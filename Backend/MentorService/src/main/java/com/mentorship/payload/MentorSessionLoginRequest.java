package com.mentorship.payload;

import lombok.Data;

@Data
public class MentorSessionLoginRequest {
    private String username;
    private String password;
}
