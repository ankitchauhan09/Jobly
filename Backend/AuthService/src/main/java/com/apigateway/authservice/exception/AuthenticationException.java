package com.apigateway.authservice.exception;

public class AuthenticationException  extends RuntimeException {

    public String message;

    public AuthenticationException(String message) {
        super(message);
    }

}
