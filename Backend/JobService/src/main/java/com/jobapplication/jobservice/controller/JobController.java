package com.jobapplication.jobservice.controller;

import com.jobapplication.jobservice.dto.JobDto;
import com.jobapplication.jobservice.entities.JobStatus;
import com.jobapplication.jobservice.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobService jobService;

    @Autowired
    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping("/search")
    public Flux<JobDto> searchJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Double minSalary,
            @RequestParam(required = false) Double maxSalary,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String employmentType,
            @RequestParam(required = false) String workplaceType,
            @RequestParam(required = false) Integer minExperience,
            @RequestParam(required = false) String industryType,
            @RequestParam(required = false) String departmentName,
            @RequestParam(required = false) String careerLevel,
            @RequestParam(required = false) String educationLevel,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return jobService.searchJobs(title, description, minSalary, maxSalary, location, employmentType,
                workplaceType, minExperience, industryType, departmentName, careerLevel, educationLevel, page, size);
    }

    @GetMapping("/search/keyword")
    public Flux<JobDto> searchJobsByKeyword(@RequestParam("keyword") String keyword, @RequestParam(name = "page", defaultValue = "0") Integer page, @RequestParam(name = "size", defaultValue = "10") Integer size) {
        return jobService.searchJobByKeyword(keyword, page, size);
    }

    @GetMapping("/skills/{skill}")
    public Flux<JobDto> findByRequiredSkills(@PathVariable String skill) {
        return jobService.findByRequiredSkills(skill);
    }

    @GetMapping("/all")
    public Flux<JobDto> findAll(@RequestParam("page") Integer page, @RequestParam("size") Integer size) {
        return jobService.getAllJobs(page, size);
    }

    @GetMapping("/benefits/{benefit}")
    public Flux<JobDto> findByBenefits(@PathVariable String benefit) {
        return jobService.findByBenefits(benefit);
    }

    @GetMapping("/company/{company}")
    public Flux<JobDto> findByCompany(@PathVariable("company") String companyId) {
        return jobService.findByCompanyId(companyId);
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<JobDto>> findById(@PathVariable String id) {
        return jobService.findByIdAndStatus(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Mono<JobDto> createJob(@RequestBody JobDto jobDto) {
        return jobService.createJob(jobDto);
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<JobDto>> updateJob(@PathVariable String id, @RequestBody JobDto jobDto) {
        return jobService.updateJob(id, jobDto)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> deleteJob(@PathVariable String id) {
        return jobService.deleteJob(id);
    }

    @PostMapping("/{id}/view")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> incrementJobViews(@PathVariable String id) {
        return jobService.incrementJobViews(id);
    }

    @PostMapping("/{id}/apply")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> incrementJobApplications(@PathVariable String id) {
        return jobService.incrementJobApplications(id);
    }
}