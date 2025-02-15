package com.jobapplication.repository;

import com.jobapplication.entities.JobApplication;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface JobApplicationRepo extends R2dbcRepository<JobApplication, String> {
    //
    @Query("INSERT INTO jobApplication(id, firstName, lastName, email, contact, jobId, currentCompanyName,currentRole, yearsOfExperience, linkedInProfileUrl, portfolioUrl, coverLetter, dateOfApply, userId, resumeUrl) VALUES (:#{#jobApplication.id}, :#{#jobApplication.firstName}, :#{#jobApplication.lastName}, :#{#jobApplication.email}, :#{#jobApplication.contact}, :#{#jobApplication.jobId}, :#{#jobApplication.currentCompanyName}, :#{#jobApplication.currentRole}, :#{#jobApplication.yearsOfExperience}, :#{#jobApplication.linkedInProfileUrl}, :#{#jobApplication.portfolioUrl}, :#{#jobApplication.coverLetter}, :#{#jobApplication.dateOfApply}, :#{#jobApplication.userId}, :#{#jobApplication.resumeUrl})")
    Mono<JobApplication> save(JobApplication jobApplication);

    @Query("SELECT id, firstName, lastName, email, contact, jobId, currentCompanyName, " +
            "currentRole, yearsOfExperience, linkedInProfileUrl, portfolioUrl, coverLetter, " +
            "DATE_FORMAT(dateOfApply, '%Y-%m-%d %H:%i:%s') as dateOfApply, userId, resumeUrl " +
            "FROM jobApplication WHERE id = :id")
    Mono<JobApplication> findJobApplicationById(String id);

    @Query("SELECT * FROM jobApplication WHERE userId = :userId")
    Flux<JobApplication> findAllByUserIdAndJobId(String userId, String jobId);

    @Query("SELECT * FROM jobapplication WHERE email = :email")
    Flux<JobApplication> findAllByUserEmail(String email);
}
