package com.apigateway.authservice.controller;

import com.apigateway.authservice.dto.UserDto;
import com.apigateway.authservice.entities.User;
import com.apigateway.authservice.exception.AuthenticationException;
import com.apigateway.authservice.payload.AuthRequest;
import com.apigateway.authservice.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;

@RestController
@RequestMapping("/auth")
@Slf4j
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private Keycloak keycloak;

    @Value("${frontend.home.url}")
    private String frontendHomeUrl;

    @PostMapping("/register")
    public Mono<ResponseEntity<UserDto>> registerUser(@RequestBody User user) {
        return authService.registerUser(user)
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)));
    }

    @GetMapping("/login/{provider}")
    public ResponseEntity<?> login(@PathVariable("provider") String provider) {
        try {
            String authorizationUrl = authService.getAuthorizationUrl(provider);
            log.info("redirectUri : {}", authorizationUrl);
            return ResponseEntity.status(HttpStatus.FOUND)
                    .body(authorizationUrl);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/callback")
    public Mono<ResponseEntity<?>> handleCallback(@RequestParam("code") String code, ServerHttpResponse response) {
        return authService.handleAuthorizationCode(code)
                .flatMap(authResponse -> authService.createOrUpdateUser(authResponse.getAccessToken())
                        .map(userDto -> {
                            try {
                                String userDtoString = new ObjectMapper().writeValueAsString(userDto);
                                String encodedUserDto = Base64.getEncoder().encodeToString(userDtoString.getBytes(StandardCharsets.UTF_8));

                                ResponseCookie accessToken = ResponseCookie.from("ACCESS-TOKEN", authResponse.getAccessToken())
                                        .httpOnly(true)
                                        .secure(true)
                                        .path("/")
                                        .maxAge(60 * 60)
                                        .sameSite("Strict")
                                        .build();

                                ResponseCookie refreshToken = ResponseCookie.from("REFRESH-TOKEN", authResponse.getRefreshToken())
                                        .httpOnly(true)
                                        .secure(true)
                                        .path("/")
                                        .maxAge(24 * 60 * 60)
                                        .sameSite("Strict")
                                        .build();

                                response.getHeaders().add(HttpHeaders.SET_COOKIE, accessToken.toString());
                                response.getHeaders().add(HttpHeaders.SET_COOKIE, refreshToken.toString());

                                URI location = UriComponentsBuilder.fromUriString(frontendHomeUrl)
                                        .queryParam("user", encodedUserDto)
                                        .build().toUri();

                                return ResponseEntity.status(HttpStatus.FOUND)
                                        .location(location)
                                        .build();
                            } catch (Exception e) {
                                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                            }
                        }));
    }

    @PostMapping("/logout")
    public Mono<ResponseEntity<Void>> logout(ServerHttpRequest request, ServerHttpResponse response) {
        return extractTokenFromCookie(request, "REFRESH-TOKEN")
                .flatMap(token -> authService.logout(token)
                        .then(Mono.fromCallable(() -> {
                            ResponseCookie clearedAccessCookie = createCookie("ACCESS-TOKEN", "", 0);
                            ResponseCookie clearedRefreshCookie = createCookie("REFRESH-TOKEN", "", 0);

                            response.addCookie(clearedAccessCookie);
                            response.addCookie(clearedRefreshCookie);

                            return ResponseEntity.ok().<Void>build();
                        })))
                .doOnError(error -> log.error("Logout failed: {}", error.getMessage()))
                .onErrorResume(error -> {
                    if (error instanceof AuthenticationException) {
                        return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).<Void>build());
                    }
                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).<Void>build());
                });
    }


    @PostMapping("/login")
    public Mono<ResponseEntity<?>> loginUser(@RequestBody AuthRequest authRequest) {
        return authService.loginUser(authRequest)
                .map(authResponse -> {
                    ResponseCookie accessToken = ResponseCookie.from("ACCESS-TOKEN", authResponse.getAccessToken())
                            .httpOnly(true)
                            .secure(true)
                            .path("/")
                            .maxAge(60 * 60)
                            .sameSite("Strict")
                            .build();

                    ResponseCookie refreshToken = ResponseCookie.from("REFRESH-TOKEN", authResponse.getRefreshToken())
                            .httpOnly(true)
                            .secure(true)
                            .path("/")
                            .maxAge(24 * 60 * 60)
                            .sameSite("Strict")
                            .build();

                    return ResponseEntity.ok()
                            .header(HttpHeaders.SET_COOKIE, accessToken.toString())
                            .header(HttpHeaders.SET_COOKIE, refreshToken.toString())
                            .body(authResponse.getUser());
                });
    }

    @PostMapping("/validate")
    public Mono<ResponseEntity<?>> validateToken(@RequestHeader("Authorization") String cookieHeader, ServerHttpRequest request) {
        return extractTokenFromCookie(request, "ACCESS-TOKEN")
                .flatMap(token -> {
                    try {
                        return authService.validateToken(token)
                                .map(result -> {
                                    return (Boolean) result.get("isValid") ? ResponseEntity.ok().build() : ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
                                });
                    } catch (Exception e) {
                        log.error("Error occurred during token validation in controller : {}", e.getMessage());
                        return Mono.error(e);
                    }
                });
    }


    private ResponseCookie createCookie(String name, String value, int maxAge) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(maxAge)
                .sameSite("Strict")
                .build();
    }

    public Mono<String> extractTokenFromCookie(ServerHttpRequest request, String cookieName) {
        return Mono.defer(() -> {
            MultiValueMap<String, HttpCookie> cookies = request.getCookies();
            HttpCookie cookie = cookies.getFirst(cookieName);
            if (cookie != null) {
                return Mono.just(cookie.getValue());
            }
            return Mono.error(new AuthenticationException(cookieName + " cookie is missing or invalid"));
        });
    }
}
