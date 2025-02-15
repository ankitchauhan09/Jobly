package com.jobapplication.jobprofileservice.service;

import com.jobapplication.jobprofileservice.entity.JobProfile;
import com.jobapplication.jobprofileservice.repository.JobProfileRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class JobProfileService {

    private final JobProfileRepo jobProfileRepo;

    public JobProfileService(JobProfileRepo jobProfileRepo) {
        this.jobProfileRepo = jobProfileRepo;
    }

    public Flux<JobProfile> getAllJobProfiles() {
        return jobProfileRepo.getAllJobProfiles();
    }

}
