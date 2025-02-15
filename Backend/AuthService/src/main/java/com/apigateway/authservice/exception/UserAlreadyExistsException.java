package com.apigateway.authservice.exception;

public class UserAlreadyExistsException extends RuntimeException {

    public String message;

    public UserAlreadyExistsException(String message) {
        super(message);
    }

}
