package com.jobapplication.service;

import com.jobapplication.dto.JobApplicationDto;
import com.jobapplication.dto.ResumeInfo;
import com.jobapplication.entities.JobApplication;
import com.jobapplication.repository.JobApplicationRepo;
import com.jobapplication.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

@Service
@Slf4j
public class JobApplicationService {

    private final JobApplicationRepo jobApplicationRepo;
    private final GoogleDriveService googleDriveService;

    JobApplicationService(JobApplicationRepo jobApplicationRepo, GoogleDriveService googleDriveService) {
        this.jobApplicationRepo = jobApplicationRepo;
        this.googleDriveService = googleDriveService;
    }

    public Mono<JobApplicationDto> submitApplication(JobApplicationDto jobApplicationDto, MultipartFile resume) throws Exception {

        return Mono.just(jobApplicationDto)
                .map(this::convertJobApplicationDtoToJobApplication)
                .flatMap(jobApplication -> {
                    try {
                        validateResume(resume);
                        String applicationId = Utils.generateRandomId(5);
                        jobApplication.setId(applicationId);

                        ResumeInfo resumeInfo = new ResumeInfo();
                        if (resume != null && !resume.isEmpty()) {
                            resumeInfo.setResumeTitle(resume.getOriginalFilename());
                            resumeInfo.setResumeSize(resume.getSize());
                            resumeInfo.setResumeContentType(resume.getContentType());
                            String fileId = uploadResumeToDrive(resume, jobApplicationDto.getUserId());
                            String resumeUrl = "https://drive.google.com/file/d/" + fileId + "/view";
                            resumeInfo.setResumeUrl(resumeUrl);
                            log.info("resume info : {}", resumeInfo);
                            jobApplication.setResumeUrl(resumeUrl);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    return jobApplicationRepo.save(jobApplication)
                            .then(Mono.just(jobApplication))  // Return the job entity after successful save
                            .doOnSuccess(submittedApplication -> log.debug("Job application saved successfully. ID: {}, Title: {}", submittedApplication.getId(), submittedApplication.getResumeUrl()))
                            .doOnError(error -> log.error("Error saving job: ", error));
                })
                .map(this::convertJobApplicationToJobApplicationDto)
                .doOnSuccess(savedJob -> log.debug("Job converted to DTO successfully. ID: {}, Title: {}", savedJob.getId(), savedJob.getResumeUrl()))
                .doOnError(error -> log.error("Error creating job: ", error));
    }

    public Flux<JobApplicationDto> getAllApplicationByUserEmail(String userEmail) {
        return jobApplicationRepo.findAllByUserEmail(userEmail)
                .collectList()
                .flatMapMany(allApplications ->
                        Flux.fromIterable(allApplications)
                                .map(this::convertJobApplicationToJobApplicationDto)
                );
    }

    public Mono<JobApplicationDto> getJobApplication(String applicationId) {
        try {
            log.info("fetching the job application with id : {}", applicationId);
            return jobApplicationRepo.findJobApplicationById(applicationId)
                    .map(jobApplication -> {
                                JobApplicationDto dto = convertJobApplicationToJobApplicationDto(jobApplication);
                                return dto;
                            }
                    );

        } catch (Exception e) {
            e.printStackTrace();
            return Mono.empty();
        }
    }

    private JobApplication convertJobApplicationDtoToJobApplication(JobApplicationDto jobApplicationDto) {
        JobApplication jobApplication = new JobApplication();
        jobApplication.setFirstName(jobApplicationDto.getFirstName());
        jobApplication.setLastName(jobApplicationDto.getLastName());
        jobApplication.setEmail(jobApplicationDto.getEmail());
        jobApplication.setContact(jobApplicationDto.getContact());
        jobApplication.setCurrentCompanyName(jobApplicationDto.getCurrentCompanyName());
        jobApplication.setCurrentRole(jobApplicationDto.getCurrentRole());
        jobApplication.setYearsOfExperience(jobApplicationDto.getYearsOfExperience());
        jobApplication.setLinkedInProfileUrl(jobApplicationDto.getLinkedInProfileUrl());
        jobApplication.setPortfolioUrl(jobApplicationDto.getPortfolioUrl());
        jobApplication.setCoverLetter(jobApplicationDto.getCoverLetter());
        jobApplication.setJobId(jobApplicationDto.getJobId());
        jobApplication.setId(jobApplicationDto.getId());
        jobApplication.setUserId(jobApplicationDto.getUserId());
        return jobApplication;
    }

    private JobApplication convertJobApplicationDtoToJobApplication(JobApplicationDto jobApplicationDto, String applicationId) {
        JobApplication jobApplication = new JobApplication();
        jobApplication.setFirstName(jobApplicationDto.getFirstName());
        jobApplication.setLastName(jobApplicationDto.getLastName());
        jobApplication.setEmail(jobApplicationDto.getEmail());
        jobApplication.setContact(jobApplicationDto.getContact());
        jobApplication.setCurrentCompanyName(jobApplicationDto.getCurrentCompanyName());
        jobApplication.setCurrentRole(jobApplicationDto.getCurrentRole());
        jobApplication.setYearsOfExperience(jobApplicationDto.getYearsOfExperience());
        jobApplication.setLinkedInProfileUrl(jobApplicationDto.getLinkedInProfileUrl());
        jobApplication.setPortfolioUrl(jobApplicationDto.getPortfolioUrl());
        jobApplication.setCoverLetter(jobApplicationDto.getCoverLetter());
        jobApplication.setJobId(jobApplicationDto.getJobId());
        jobApplication.setId(applicationId);
        jobApplication.setUserId(jobApplicationDto.getUserId());
        return jobApplication;
    }

    private JobApplicationDto convertJobApplicationToJobApplicationDto(JobApplication jobApplication) {
        JobApplicationDto jobApplicationDto = new JobApplicationDto();
        jobApplicationDto.setFirstName(jobApplication.getFirstName());
        jobApplicationDto.setLastName(jobApplication.getLastName());
        jobApplicationDto.setEmail(jobApplication.getEmail());
        jobApplicationDto.setContact(jobApplication.getContact());
        jobApplicationDto.setCurrentCompanyName(jobApplication.getCurrentCompanyName());
        jobApplicationDto.setCurrentRole(jobApplication.getCurrentRole());
        jobApplicationDto.setYearsOfExperience(jobApplication.getYearsOfExperience());
        jobApplicationDto.setLinkedInProfileUrl(jobApplication.getLinkedInProfileUrl());
        jobApplicationDto.setPortfolioUrl(jobApplication.getPortfolioUrl());
        jobApplicationDto.setCoverLetter(jobApplication.getCoverLetter());
        jobApplicationDto.setJobId(jobApplication.getJobId());
        jobApplicationDto.setId(jobApplication.getId());
        jobApplicationDto.setResumeUrl(jobApplication.getResumeUrl());
        return jobApplicationDto;
    }


    private void validateResume(MultipartFile resume) throws Exception {
        if (resume == null || resume.isEmpty()) {
            throw new IllegalArgumentException("resume is null or empty");
        }
        log.info("this resume is received");

        String contentType = resume.getContentType();
        if (contentType == null || contentType.isEmpty()) {
            // Try to determine the content type based on the file extension
            String fileName = resume.getOriginalFilename();
            if (fileName != null && !fileName.isEmpty()) {
                int dotIndex = fileName.lastIndexOf(".");
                if (dotIndex > 0) {
                    String extension = fileName.substring(dotIndex + 1).toLowerCase();
                    switch (extension) {
                        case "pdf":
                            contentType = "application/pdf";
                            break;
                        case "doc":
                        case "docx":
                            contentType = "application/msword";
                            break;
                        // Add more extensions as needed
                    }
                }
            }
        }

        if (contentType == null || (!contentType.equals("application/pdf") &&
                !contentType.equals("application/msword") && !contentType.equals("application/octet-stream") &&
                !contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))) {
            throw new IllegalArgumentException("Invalid file type. Only PDF and DOCX files are allowed");
        }

        if (resume.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("resume size is too large to be accepted");
        }
    }

    public String uploadResumeToDrive(MultipartFile resume, String userId) {
        try {
            String fileId = googleDriveService.uploadFileToDrive(resume, userId);
            log.info("file received : {}", fileId);
            return fileId;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    public Mono<Boolean> isApplied(String jobId, String userId) {
        return jobApplicationRepo.findAllByUserIdAndJobId(userId, jobId)
                .doOnError(error -> log.error("Error occurred while checking job application is applied status: {}", error.getMessage()))
                .collectList()
                .map(allApplications -> {
                    log.info("allApplications : {}", allApplications);
                    log.info("status : {}", !allApplications.isEmpty());
                    return !allApplications.isEmpty();
                });
    }
}
