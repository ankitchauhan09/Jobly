package com.apigateway.authservice.feign_clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@FeignClient(name = "keycloakClient", url = "${keycloak.server.url}/realms/${keycloak.realm}/protocol/openid-connect")
public interface KeycloakClient {
    @PostMapping(value = "/token", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    Map<String, Object> getToken(@RequestBody Map<String, ?> form);
}