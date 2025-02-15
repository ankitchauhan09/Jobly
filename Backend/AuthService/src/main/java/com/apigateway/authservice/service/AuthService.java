package com.apigateway.authservice.service;

import com.apigateway.authservice.AuthServiceApplication;
import com.apigateway.authservice.dto.UserDto;
import com.apigateway.authservice.entities.User;
import com.apigateway.authservice.exception.AuthenticationException;
import com.apigateway.authservice.exception.UserAlreadyExistsException;
import com.apigateway.authservice.feign_clients.KeycloakClient;
import com.apigateway.authservice.payload.*;
import com.apigateway.authservice.repository.UserRepo;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.ws.rs.core.Response;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.TokenVerifier;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.common.VerificationException;
import org.keycloak.representations.AccessToken;
import org.keycloak.representations.idm.ClientRepresentation;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.web.client.RestClientAutoConfiguration;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.util.UriUtils;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Slf4j
@Service
public class AuthService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private Keycloak keycloak;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private KeycloakClient keycloakClient;

    @Autowired
    private WebClient webClient;

    @Value("${keycloak.server.url}")
    private String serverUrl;
    @Value("${keycloak.realm}")
    private String keycloakRealm;
    @Value("${keycloak.clientId}")
    private String clientId;
    @Value("${keycloak.clientSecret}")
    private String clientSecret;
    @Value("${authorization.redirect.uri}")
    private String authRedirectUri;



    public String getAuthorizationUrl(String provider) {
        String state = UUID.randomUUID().toString();
        String encodedRedirectUri = UriUtils.encode(authRedirectUri, StandardCharsets.UTF_8);

        return UriComponentsBuilder.fromHttpUrl(serverUrl)
                .path("/realms/" + keycloakRealm + "/protocol/openid-connect/auth")
                .queryParam("client_id", clientId)
                .queryParam("response_type", "code")
                .queryParam("scope", "openid")
                .queryParam("redirect_uri", encodedRedirectUri)
                .queryParam("state", state)
                .queryParam("kc_idp_hint", provider.toLowerCase().trim())
                .buildAndExpand(keycloakRealm)
                .toUriString();
    }

    public Mono<JwtAuthResponse> handleAuthorizationCode(String code) {
        String tokenEndpoint = serverUrl + "/realms/" + keycloakRealm + "/protocol/openid-connect/token";

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "authorization_code");
        formData.add("client_id", clientId);
        formData.add("client_secret", clientSecret);
        formData.add("code", code);
        formData.add("redirect_uri", authRedirectUri);

        return webClient.post()
                .uri(tokenEndpoint)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(Map.class)
                .flatMap(response -> {
                    String accessToken = (String) response.get("access_token");
                    String refreshToken = (String) response.get("refresh_token");
                    return createOrUpdateUser(accessToken)
                            .map(userDto -> new JwtAuthResponse(accessToken, refreshToken, userDto));
                });
    }

    public String exchangeCodeForToken(String code) {
        String tokenEndpoint = serverUrl + "/realms/" + keycloakRealm + "/protocol/openid-connect/token";
        return webClient.post()
                .uri(tokenEndpoint)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData("grant_type", "authorization_code")
                        .with("client_id", clientId)
                        .with("client_secret", clientSecret)
                        .with("code", code)
                        .with("redirect_uri", authRedirectUri)
                )
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> (String) response.get("access_token"))
                .block();
    }

    public Mono<UserDto> registerUser(User user) {
        return userRepo.findByEmail(user.getEmail())
                .flatMap(existingUser -> Mono.<UserDto>error(
                        new UserAlreadyExistsException("User with this email already exists")))
                .switchIfEmpty(
                        Mono.defer(() -> {
                            try {
                                String userId = createKeycloakUser(user);
                                user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
                                user.setId(userId);
                                return userRepo.save(user)
                                        .doOnNext(savedUser -> log.info("User registered: {}", savedUser))
                                        .map(this::convertToDto);
                            } catch (Exception e) {
                                log.error("Error registering user: {}", e.getMessage(), e);
                                return Mono.<UserDto>error(
                                        new RuntimeException("Failed to register user. Please try again later."));
                            }
                        })
                );
    }

//    public String extractTokenFromRequest(HttpServletRequest request) {
//        // Retrieve the JWT token from the cookies
//        Cookie[] cookies = request.getCookies();
//
//        if (cookies != null) {
//            for (Cookie cookie : cookies) {
//                // Check for the specific cookie name where the token is stored
//                if ("JWT-TOKEN".equals(cookie.getName())) {
//                    return cookie.getValue(); // Return the token value
//                }
//            }
//        }
//
//        // If the token is not found, throw an exception or return null
//        throw new AuthenticationException("JWT token cookie is missing or invalid");
//    }

    public Mono<Void> logout(String refreshToken) {
        String logoutUrl = serverUrl + "/realms/" + keycloakRealm + "/protocol/openid-connect/logout";

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("refresh_token", refreshToken);
        formData.add("client_id", clientId);
        formData.add("client_secret", clientSecret);

        return webClient.post()
                .uri(logoutUrl)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .onStatus(HttpStatusCode::isError, response ->
                        Mono.error(new RuntimeException("Logout request failed with status: " + response.statusCode()))
                )
                .bodyToMono(Void.class) // Since you don't need the response body, use Void.class for clarity.
                .onErrorMap(e -> new RuntimeException("Logout failed", e)); // Map errors to a custom exception.
    }


//
//    public String generateToken(UserDto userDto) {
//        Date now = new Date();
//
//    }

    private void assignKeycloakRoles(String userId, String roleName) throws Exception {
        RealmResource realmResource = keycloak.realm(keycloakRealm);
        UserResource userResource = realmResource.users().get(userId);

        RoleRepresentation rs = realmResource.roles().get(roleName.equalsIgnoreCase("RECRUITER") ? "recruiter" : "job_seeker")
                .toRepresentation();

        userResource.roles().realmLevel().add(Arrays.asList(rs));

        Optional<ClientRepresentation> clientRepresentationOptional = realmResource.clients().findByClientId(clientId).stream().findFirst();
        if (clientRepresentationOptional.isPresent()) {
            RoleRepresentation userClientRole = realmResource.clients().get(clientRepresentationOptional.get().getId())
                    .roles().get("user").toRepresentation();
            userResource.roles().clientLevel(clientRepresentationOptional.get().getId()).add(Arrays.asList(userClientRole));
        } else {
            log.warn("Client not found : {}", clientId);
        }
    }

    private void setKeycloakPassword(String userId, String password) {
        CredentialRepresentation passwordCredentials = new CredentialRepresentation();
        passwordCredentials.setType(CredentialRepresentation.PASSWORD);
        passwordCredentials.setValue(password);
        passwordCredentials.setTemporary(false);

        RealmResource realm = keycloak.realm(keycloakRealm);
        UserResource userResource = realm.users().get(userId);
        userResource.resetPassword(passwordCredentials);
    }

    public Mono<UserDto> createOrUpdateUser(String token) {
        return Mono.defer(() -> {
            try {
                AccessToken accessToken = TokenVerifier.create(token, AccessToken.class).getToken();
                String email = accessToken.getEmail();
                String firstName = accessToken.getGivenName();
                String lastName = accessToken.getFamilyName();
                String userId = accessToken.getSubject();

                User userTemplate = new User();
                userTemplate.setEmail(email);
                userTemplate.setName(firstName + " " + lastName);
                userTemplate.setId(userId);

                return userRepo.findById(userId)
                        .defaultIfEmpty(userTemplate)
                        .flatMap(user -> userRepo.save(user)
                                .map(this::convertToDto))
                        .onErrorMap(error -> {
                            log.error("Error occurred while processing user with id: {}", userId, error);
                            return new RuntimeException("Failed to process user", error);
                        });
            } catch (VerificationException e) {
                log.error("Error while verifying the access token", e);
                return Mono.error(new RuntimeException("Invalid token", e));
            }
        });
    }

    private String createKeycloakUser(User user) throws Exception {
        UserRepresentation keycloakUser = new UserRepresentation();
        keycloakUser.setEnabled(true);
        keycloakUser.setUsername(user.getEmail());
        keycloakUser.setEmail(user.getEmail());
        keycloakUser.setFirstName(user.getName().split(" ")[0]);
        keycloakUser.setLastName(user.getName().split(" ")[1]);
        keycloakUser.setEmailVerified(false);
        keycloakUser.setAttributes(Collections.singletonMap("origin", Arrays.asList("demo")));

        Response response = keycloak.realm(keycloakRealm).users().create(keycloakUser);
        if (response.getStatus() != 201) {
            log.error("Failed to create user in keycloak. Status : {}", response.getStatus());
            throw new RuntimeException("Failed to create user in keycloak. Status : " + response.getStatus());
        }

        String userId = CreatedResponseUtil.getCreatedId(response);

        RealmResource realmResource = keycloak.realm(keycloakRealm);
        UsersResource usersResource = realmResource.users();
        List<UserRepresentation> userRepresentations = usersResource.searchByEmail(user.getEmail(), true);
        log.info("users list : {}", userRepresentations);
        if (!userRepresentations.isEmpty()) {
            UserRepresentation userRepresentation = userRepresentations.stream().filter(userRepresentation1 -> Objects.equals(false, userRepresentation1.isEmailVerified())).findFirst().orElse(null);
            assert userRepresentation != null;
            emailVerification(userRepresentation.getId());
            log.info("email sent to user : {}", userRepresentation.getId());
        }
        log.info("User created in Keycloak with userId : {}", userId);
        return userId;
    }

    private void emailVerification(String id) {
        UsersResource usersResource = keycloak.realm(keycloakRealm).users();
        usersResource.get(id).sendVerifyEmail();
    }


    public Mono<JwtAuthResponse> loginUser(AuthRequest authRequest) {
        Map<String, String> form = new HashMap<>();
        form.put("client_id", clientId);
        form.put("client_secret", clientSecret);
        form.put("username", authRequest.getUsername());
        form.put("password", authRequest.getPassword());
        form.put("grant_type", "password");

        return Mono.fromCallable(() -> keycloakClient.getToken(form))
                .flatMap(response -> {
                    String accessToken = response.get("access_token").toString();
                    String refreshToken = response.get("refresh_token").toString();

                    return userRepo.findByEmail(authRequest.getUsername())
                            .switchIfEmpty(Mono.error(new UsernameNotFoundException("User not found")))
                            .map(user -> new JwtAuthResponse(accessToken, refreshToken, convertToDto(user)));
                })
                .onErrorMap(e -> new AuthenticationException("Authentication failed"));
    }

    public Mono<Map<String, Object>> validateToken(String token) throws Exception {
        return Mono.defer(() -> {
            try {
                AccessToken accessToken = TokenVerifier.create(token, AccessToken.class).getToken();
                String username = accessToken.getSubject();
                Set<String> roles = accessToken.getResourceAccess().get(clientId).getRoles();
                Boolean isValid = !roles.isEmpty();
                String fullName = accessToken.getName();

                return userRepo.findByEmail(username)
                        .map(fetchedUser -> {
                            Map<String, Object> result = new HashMap<>();
                            result.put("email", fetchedUser.getEmail());
                            result.put("name", fetchedUser.getName());
                            result.put("isValid", isValid);
                            result.put("userInfo", convertToDto(fetchedUser));
                            result.put("fullName", fullName);
                            return result;
                        })
                        .doOnError(error -> log.error("Error occurred while fetching the user : {}", error.getMessage()));
            } catch (Exception e) {
                log.error("Error occurred while validating the token : {}", e.getMessage());
                return Mono.error(e);
            }
        });
    }

    private User convertToEntity(UserDto userDto) {
        User user = new User();
        user.setId(userDto.getId());
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setDescription(userDto.getDescription());
        user.setContact(userDto.getContact());
        user.setRoleName(userDto.getRoleName());
        user.setProfilePicUrl(userDto.getProfilePicUrl());

        if (!user.getSkills().isEmpty()) {
            try {
                String userSkillsJsonString = objectMapper.writeValueAsString(userDto.getSkills());
                user.setSkills(userSkillsJsonString);
            } catch (JsonProcessingException e) {
                user.setSkills("");
                log.error("Error while parsing the user skills in convertToEntity method : {}", e.getMessage());
            }
        } else {
            user.setSkills("");
        }
        if (!user.getEducations().isEmpty()) {
            try {
                String userEducationsJsonString = objectMapper.writeValueAsString(userDto.getEducations());
                user.setEducations(userEducationsJsonString);
            } catch (JsonProcessingException e) {
                user.setEducations("");
                log.error("Error while parsing the user educations in convertToEntity method : {}", e.getMessage());
            }
        } else {
            user.setEducations("");
        }
        return user;
    }

    private UserDto convertToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());
        userDto.setAddress(user.getAddress());
        userDto.setContact(user.getContact());
        userDto.setRoleName(user.getRoleName());
        userDto.setDescription(user.getDescription());
        userDto.setProfilePicUrl(user.getProfilePicUrl());
        if (!user.getSocialLinks().isEmpty()) {
            try {
                userDto.setSocialLinks(objectMapper.readValue(user.getSocialLinks(), new TypeReference<List<SocialLinks>>() {
                }));
            } catch (IOException e) {
                log.error("Error while converting the userdto social links : {}", e.getMessage());
            }
        }
        if (!user.getSkills().isEmpty()) {
            try {
                userDto.setSkills(objectMapper.readValue(user.getSkills(), new TypeReference<List<SkillPayload>>() {
                }));
            } catch (JsonProcessingException e) {
                log.error("Error whilee converting the userdto skills : {}", e.getMessage());
            }
        }
        if (!user.getEducations().isEmpty()) {
            try {
                userDto.setEducations(objectMapper.readValue(user.getEducations(), new TypeReference<List<Education>>() {
                }));
            } catch (JsonProcessingException e) {
                log.error("Error whilee converting the userdto educations : {}", e.getMessage());
            }
        }
        return userDto;
    }

}
