package com.mentorship.repositories;

import com.mentorship.entities.ServiceByMentor;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Mono;

public interface MentorServiceRepo extends R2dbcRepository<ServiceByMentor, Integer> {


    @Query("SELECT * FROM mentor_services WHERE service_id = :serviceId")
    Mono<ServiceByMentor> findById(Integer serviceId);

}
