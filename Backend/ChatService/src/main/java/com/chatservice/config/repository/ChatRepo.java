package com.chatservice.config.repository;

import com.chatservice.payload.Message;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface ChatRepo extends R2dbcRepository<Message, String> {

    @Query("SELECT * FROM chat_messages WHERE sender_id= :senderId AND receiver_id= :receiverId")
    public Flux<Message> findAllMessages(String senderId, String receiverId);

}
