package com.jobapplication.jobprofileservice.controller;

import com.jobapplication.jobprofileservice.entity.JobProfile;
import com.jobapplication.jobprofileservice.service.JobProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/job/profiles")
public class JobProfileController {

    @Autowired
    private JobProfileService jobProfileService;

    @GetMapping("/all")
    Flux<JobProfile> getAllJobProfile() {
        return jobProfileService.getAllJobProfiles();
    }
}
