package com.jobapplication.jobservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
    import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobapplication.jobservice.dto.JobDto;
import com.jobapplication.jobservice.entities.Job;
import com.jobapplication.jobservice.entities.JobStatus;
import com.jobapplication.jobservice.repository.JobRepo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class JobService {

    private final JobRepo jobRepo;
    private final ObjectMapper objectMapper;

    @Autowired
    public JobService(JobRepo jobRepo, ObjectMapper objectMapper) {
        this.jobRepo = jobRepo;
        this.objectMapper = objectMapper;
    }

    public Flux<JobDto> searchJobByKeyword(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return jobRepo.searchJobByKeyword(keyword, pageable)
                .doOnNext(job -> log.info("Found job : {}", job))
                .map(this::convertEntityToDto)
                .doOnError(error -> log.error("Error searching jobs : {}", error));
    }

    public Flux<JobDto> searchJobs(String title, String description, Double minSalary, Double maxSalary,
                                   String location, String employmentType, String workplaceType,
                                   Integer minExperience, String industryType, String departmentName,
                                   String careerLevel, String educationLevel, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        log.info("Searching for jobs with title: {}", title); // Add this log
        return jobRepo.searchJobs(title, pageable)
                .doOnNext(job -> log.info("Found job: {}", job)) // Add this log
                .map(this::convertEntityToDto)
                .doOnError(error -> log.error("Error searching jobs: ", error));
    }

    public Flux<JobDto> getAllJobs(Integer page, Integer size) {
        int offset = page * size;
        return jobRepo.findAllPaged(offset, size)
                .map(this::convertEntityToDto)
                .switchIfEmpty(Flux.defer(() -> {
                    log.info("No Jobs found");
                    return Flux.empty();
                }))
                .doOnError(error -> log.error("Error fetching jobs: {}", error.getMessage()));
    }

    public Flux<JobDto> findByRequiredSkills(String skill) {
        return jobRepo.findByRequiredSkills(skill)
                .map(this::convertEntityToDto)
                .doOnError(error -> log.error("Error finding jobs by required skills: ", error));
    }

    public Flux<JobDto> findByBenefits(String benefit) {
        return jobRepo.findByBenefits(benefit)
                .map(this::convertEntityToDto)
                .doOnError(error -> log.error("Error finding jobs by benefits: ", error));
    }

    public Flux<JobDto> findByCompanyId(String companyId) {
        return this.jobRepo.findByCompanyId(companyId)
                .map(this::convertEntityToDto)
                .doOnError(error -> log.error("Error finding jobs by companyId: ", error));
    }


    public Mono<JobDto> findByIdAndStatus(String id) {
        return jobRepo.findByIdAndStatus(id)
                .map(this::convertEntityToDto)
                .doOnError(error -> log.error("Error finding job by id and status: ", error));
    }

    public Mono<JobDto> createJob(JobDto jobDto) {
        log.debug("Creating job with title: {}", jobDto.getTitle());
        return Mono.just(jobDto)
                .map(this::convertDtoToEntity)
                .flatMap(job -> {
                    job.setId(UUID.randomUUID().toString());
                    job.setCreatedAt(LocalDateTime.now());
                    job.setStatus(JobStatus.DRAFT);
                    job.setViews(0L);
                    job.setApplications(0L);
                    log.debug("Saving job with title: {}", job.getTitle());
                    return jobRepo.save(job)
                            .then(Mono.just(job))  // Return the job entity after successful save
                            .doOnSuccess(savedJob -> log.debug("Job saved successfully. ID: {}, Title: {}", savedJob.getId(), savedJob.getTitle()))
                            .doOnError(error -> log.error("Error saving job: ", error));
                })
                .map(this::convertEntityToDto)
                .doOnSuccess(savedJob -> log.debug("Job converted to DTO successfully. ID: {}, Title: {}", savedJob.getId(), savedJob.getTitle()))
                .doOnError(error -> log.error("Error creating job: ", error));
    }

    public Mono<JobDto> updateJob(String id, JobDto jobDto) {
        return jobRepo.findById(id)
                .flatMap(existingJob -> {
                    updateJobFromDto(existingJob, jobDto);
                    existingJob.setUpdatedAt(LocalDateTime.now());
                    return jobRepo.save(existingJob);
                })
                .map(this::convertEntityToDto)
                .doOnError(error -> log.error("Error updating job: ", error));
    }

    public Mono<Void> deleteJob(String id) {
        return jobRepo.deleteById(id)
                .doOnError(error -> log.error("Error deleting job: ", error));
    }

    public Mono<Void> incrementJobViews(String id) {
        return jobRepo.incrementJobViews(id)
                .doOnError(error -> log.error("Error incrementing job views: ", error));
    }

    public Mono<Void> incrementJobApplications(String id) {
        return jobRepo.incrementJobApplications(id)
                .doOnError(error -> log.error("Error incrementing job applications: ", error));
    }

    private Job convertDtoToEntity(JobDto jobDto) {
        Job job = new Job();
        updateJobFromDto(job, jobDto);
        return job;
    }

    private JobDto convertEntityToDto(Job job) {
        JobDto dto = new JobDto();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setCompanyId(job.getCompanyId());
        dto.setMinSalary(job.getMinSalary());
        dto.setMaxSalary(job.getMaxSalary());
        dto.setLocation(job.getLocation());
        dto.setEmploymentType(job.getEmploymentType());
        dto.setWorkplaceType(job.getWorkplaceType());
        dto.setMinExperience(job.getMinExperience());
        dto.setIndustryType(job.getIndustryType());
        dto.setDepartmentName(job.getDepartmentName());
        dto.setCareerLevel(job.getCareerLevel());
        dto.setEducationLevel(job.getEducationLevel());
        dto.setApplicationDeadline(job.getApplicationDeadline());

        try {
            dto.setRequiredSkills(objectMapper.readValue(job.getRequiredSkillsJson(), new TypeReference<List<String>>() {
            }));
            dto.setPreferredSkills(objectMapper.readValue(job.getPreferredSkillsJson(), new TypeReference<List<String>>() {
            }));
            dto.setBenefits(objectMapper.readValue(job.getBenefitsJson(), new TypeReference<List<String>>() {
            }));
        } catch (JsonProcessingException e) {
            log.error("Error converting JSON fields", e);
            throw new RuntimeException("Error converting JSON fields", e);
        }

        return dto;
    }

    private void updateJobFromDto(Job job, JobDto jobDto) {
        job.setTitle(jobDto.getTitle());
        job.setDescription(jobDto.getDescription());
        job.setCompanyId(jobDto.getCompanyId());
        job.setMinSalary(jobDto.getMinSalary());
        job.setMaxSalary(jobDto.getMaxSalary());
        job.setLocation(jobDto.getLocation());
        job.setEmploymentType(jobDto.getEmploymentType());
        job.setWorkplaceType(jobDto.getWorkplaceType());
        job.setMinExperience(jobDto.getMinExperience());
        job.setIndustryType(jobDto.getIndustryType());
        job.setDepartmentName(jobDto.getDepartmentName());
        job.setCareerLevel(jobDto.getCareerLevel());
        job.setEducationLevel(jobDto.getEducationLevel());
        job.setApplicationDeadline(jobDto.getApplicationDeadline());

        try {
            job.setRequiredSkillsJson(objectMapper.writeValueAsString(jobDto.getRequiredSkills()));
            job.setPreferredSkillsJson(objectMapper.writeValueAsString(jobDto.getPreferredSkills()));
            job.setBenefitsJson(objectMapper.writeValueAsString(jobDto.getBenefits()));
        } catch (JsonProcessingException e) {
            log.error("Error converting JSON fields", e);
            throw new RuntimeException("Error converting JSON fields", e);
        }
    }
}