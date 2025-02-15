package com.jobapplication.jobprofileservice.repository;

import com.jobapplication.jobprofileservice.entity.JobProfile;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface JobProfileRepo extends R2dbcRepository<JobProfile, Integer> {

    @Query("SELECT * FROM job_profile")
    public Flux<JobProfile> getAllJobProfiles();

}
