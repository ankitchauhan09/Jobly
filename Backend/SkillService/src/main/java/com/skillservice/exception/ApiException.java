package com.skillservice.exception;

import lombok.*;

@Getter
@Setter
public class ApiException extends RuntimeException{
    String message;
    Integer statusCode;
    public ApiException(String message, Integer statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}
