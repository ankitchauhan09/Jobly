package com.sih.hexstar.user.controller;

import com.sih.hexstar.user.dto.UserDto;
import com.sih.hexstar.user.entities.User;
import com.sih.hexstar.user.payloads.SocialLinks;
import com.sih.hexstar.user.services.UserServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.checkerframework.checker.index.qual.Positive;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.transaction.TransactionAutoConfiguration;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/user/")
@Slf4j
public class UserController {

    @Autowired
    private UserServiceImpl userService;
    @Autowired
    private TransactionAutoConfiguration transactionAutoConfiguration;

    @GetMapping("/")
    public Mono<ResponseEntity<UserDto>> getUserByEmail(@RequestParam("email") String email) {
        try {
            return userService.getUserByEmail(email)
                    .map(ResponseEntity::ok)
                    .doOnError(error -> log.error("Error occurred while fetching user by email : {}", error.getMessage()));
        } catch (Exception e) {
            return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).build());
        }
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<UserDto>> getUserById(@PathVariable("id") String id) {
        try {
            return userService.getUserById(id)
                    .map(ResponseEntity::ok)
                    .doOnError(error -> log.error("Error occurred while fetching user by id : {}", error.getMessage()));
        } catch (Exception e) {
            return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).build());
        }
    }

    @PutMapping("/update")
    public Mono<ResponseEntity<UserDto>> updateUser(@RequestBody UserDto user) {
        try {
            return userService.updateUser(user)
                    .map(ResponseEntity::ok)
                    .doOnError(error -> log.error("Error occurred while updating user by id : {} with error : {}", user.getId(), error.getMessage()));
        } catch (Exception e) {
            return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).build());
        }
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteUser(@PathVariable("id") String id) {
        try {
            return userService.deleteUserById(id)
                    .map(ResponseEntity::ok)
                    .doOnError(error -> log.error("Error while deleting user with id : {}", id));
        } catch (Exception e) {
            return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).build());
        }
    }


    @PostMapping(value = "/update/image/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<ResponseEntity<UserDto>> uploadImage(
            @PathVariable String userId,
            @RequestPart("profilePic") Mono<FilePart> file) {

        return file.flatMap(filePart -> {
            log.info("Filename: {}", filePart.filename());
            return DataBufferUtils.join(filePart.content())
                    .map(DataBuffer::asByteBuffer)
                    .map(buffer -> {
                        byte[] bytes = new byte[buffer.remaining()];
                        buffer.get(bytes);
                        return bytes;
                    })
                    .flatMap(bytes -> userService.updateUserProfilePic(userId, file))
                    .map(ResponseEntity::ok);
        });
    }

    @PostMapping("/update/socialLinks/{userId}")
    public Mono<ResponseEntity<UserDto>> updateUserSocialLinks(
            @PathVariable("userId") String userId,
            @RequestBody SocialLinks socialLinks
    ) {
        // Add logging to verify incoming data
        log.info("Received userId: {}", userId);
        log.info("Received socialLinks: {}", socialLinks);

        // Validate input
        if (socialLinks == null) {
            log.error("Social links cannot be null");
            return Mono.just(ResponseEntity.badRequest().build());
        }

        try {
            return userService.updateUserSocialLinks(socialLinks, userId)
                    .map(ResponseEntity::ok)
                    .doOnError(error -> log.error("Error while updating user social links: {}", error.getMessage()))
                    .onErrorResume(error -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()));
        } catch (Exception e) {
            log.error("Unexpected error", e);
            return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
        }
    }

    @PostMapping("/update/contact/{userId}")
    public Mono<ResponseEntity<UserDto>> updateUserContact(@PathVariable("userId") String userId, @RequestBody UserDto user) {
        return userService.updateUserContact(user, userId)
                .map(ResponseEntity::ok)
                .doOnError(error -> log.error("Error while updating user contacts: {}", error.getMessage()))
                .onErrorResume(error -> Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()));
    }

}
