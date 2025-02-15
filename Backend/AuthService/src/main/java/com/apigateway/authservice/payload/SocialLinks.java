package com.apigateway.authservice.payload;

import lombok.Data;

@Data
public class SocialLinks {
    private String label;
    private String tag;
    private String url;
}
