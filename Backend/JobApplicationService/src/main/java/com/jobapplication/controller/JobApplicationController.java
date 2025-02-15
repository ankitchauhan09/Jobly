package com.jobapplication.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobapplication.dto.JobApplicationDto;
import com.jobapplication.service.JobApplicationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@Slf4j
@RequestMapping("/job-application")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    public JobApplicationController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    @PostMapping(value = "/submit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    Mono<ResponseEntity<?>> submitApplication(
            @RequestParam("resume") MultipartFile resume,
            @RequestParam("applicationData") String jobApplicationJson) throws Exception {

        // Parse JSON manually
        ObjectMapper mapper = new ObjectMapper();
        JobApplicationDto jobApplicationDto = mapper.readValue(jobApplicationJson, JobApplicationDto.class);
        log.info("dto {}", jobApplicationDto);
        return jobApplicationService.submitApplication(jobApplicationDto, resume)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/get-application/{applicationId}")
    Mono<ResponseEntity<?>> getApplication(@PathVariable String applicationId) {
        return this.jobApplicationService.getJobApplication(applicationId)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/is-applied/{jobId}/{userId}")
    public Mono<ResponseEntity<?>> isApplied(@PathVariable String jobId, @PathVariable String userId) {
        log.info("received job id and user id : {} and {}", jobId, userId);
        return jobApplicationService.isApplied(jobId, userId)
                .map(ResponseEntity::ok);
    }

    @GetMapping("/all/{email}")
    public Flux<ResponseEntity<JobApplicationDto>> getAllApplicationsOfUser(@PathVariable("email") String email) {
        return jobApplicationService.getAllApplicationByUserEmail(email)
                .map(ResponseEntity::ok)
                .doOnError(error -> log.error("Error while fetching the job applications for user with email : {}", error.getMessage()));
    }


}
