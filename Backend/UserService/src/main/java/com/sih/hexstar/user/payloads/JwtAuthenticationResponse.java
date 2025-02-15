package com.sih.hexstar.user.payloads;

import com.sih.hexstar.user.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtAuthenticationResponse {
    String token;
    UserDto user;
}
