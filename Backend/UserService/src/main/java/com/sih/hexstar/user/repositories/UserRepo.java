package com.sih.hexstar.user.repositories;

import com.sih.hexstar.user.entities.User;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.Optional;

 public interface UserRepo extends R2dbcRepository<User, String> {

    @Query("SELECT * FROM users WHERE email = :email")
   Mono<User> findByEmail(String email);

    @Query("SELECT * FROM users WHERE id = :id")
    Mono<User> findById(String id);

    @Query("SELECT * FROM users WHERE email = :email")
    Mono<User> findUserByEmail(String email);

    @Query("UPDATE users SET name = :#{#user.name},  WHERE id = :#{#user.id} AND email = :#{#user.email}")
    Mono<User> updateUser(User user);

    @Query("UPDATE users SET profile_pic_url = :profilePicUrl WHERE id = :userId")
    Mono<Void> updateUserProfilePicUrl(String profilePicUrl, String userId);

    @Query("UPDATE users SET socialLinks = :socialLinks WHERE id = :userId")
    Mono<Void> updateSocialLink(String socialLinks, String userId);

    @Query("UPDATE users SET contact = :#{#user.contact} WHERE id = :#{#user.id}")
    Mono<Void> updateUserContact(User user);
}
