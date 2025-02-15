package com.apigateway.authservice.payload;

import com.apigateway.authservice.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class JwtAuthResponse {
    private String accessToken;
    private String refreshToken;
    private UserDto user;
}
