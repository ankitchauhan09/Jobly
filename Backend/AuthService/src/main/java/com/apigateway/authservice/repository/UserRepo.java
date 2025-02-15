package com.apigateway.authservice.repository;

import com.apigateway.authservice.entities.User;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface UserRepo extends R2dbcRepository<User, String> {

//    @Query("INSERT INTO users(id, name, email, description, contact, role_name, address, socialLinks, skills, educations, profile_pic_url) VALUES(:#{#user.id}, :#{#user.name}, :#{#user.email}, :#{#user.description}, :#{#user.contact}, :#{#user.roleName}, :#{#user.address}, :#{#user.socialLinks}, :#{#user.skills}, :#{#user.educations}, #{#user.profile_pic_url});")
//    public Mono<User> saveUser(User user);


    @Query("SELECT * FROM users WHERE email = :email")
    public Mono<User> findByEmail(String email);

    @Query("SELECT * FROM users WHERE id = :id")
    public Mono<User> findById(String id);
}
