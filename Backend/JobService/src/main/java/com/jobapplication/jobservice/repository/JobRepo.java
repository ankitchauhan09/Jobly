package com.jobapplication.jobservice.repository;

import com.jobapplication.jobservice.entities.Job;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface JobRepo extends R2dbcRepository<Job, String> {

    @Query("SELECT * FROM job WHERE LOWER(title) LIKE LOWER(CONCAT('%', :title , '%'))")
    Flux<Job> searchJobs(
            String title,
            Pageable pageable
    );

    @Query("SELECT * FROM job WHERE LOWER(title) LIKE LOWER(CONCAT('%', :keyword, '%'));")
    Flux<Job> searchJobByKeyword(String keyword, Pageable pageable);

    @Query("INSERT INTO job (id, title, description, companyId, min_salary, max_salary, location, employment_type, min_experience, max_experience, required_skills_json, preferred_skills_json, benefits_json, workplace_type, application_deadline, status, views, applications, industry_type, department_name, career_level, education_level, created_at, updated_at, created_by) " +
            "VALUES (:#{#job.id}, :#{#job.title}, :#{#job.description}, :#{#job.companyId}, :#{#job.minSalary}, :#{#job.maxSalary}, :#{#job.location}, :#{#job.employmentType}, :#{#job.minExperience}, :#{#job.maxExperience}, :#{#job.requiredSkillsJson}, :#{#job.preferredSkillsJson}, :#{#job.benefitsJson}, :#{#job.workplaceType}, :#{#job.applicationDeadline}, :#{#job.status}, :#{#job.views}, :#{#job.applications}, :#{#job.industryType}, :#{#job.departmentName}, :#{#job.careerLevel}, :#{#job.educationLevel}, :#{#job.createdAt}, :#{#job.updatedAt}, :#{#job.createdBy})")
    Mono<Job> save(Job job);

    // For required skills and benefits, we need a different approach
    // You might want to consider storing these as JSON strings in MySQL
    // and then use JSON functions to search within them

    @Query("SELECT * FROM job WHERE companyId = :companyId")
    Flux<Job> findByCompanyId(String companyId);


    @Query("SELECT * FROM job LIMIT :size OFFSET :offset")
    Flux<Job> findAllPaged(int offset, int size);

    @Query("SELECT * FROM jobs WHERE status = 'PUBLISHED' AND application_deadline > CURRENT_TIMESTAMP AND JSON_CONTAINS(required_skills, JSON_ARRAY(:skill))")
    Flux<Job> findByRequiredSkills(String skill);

    @Query("SELECT * FROM jobs WHERE status = 'PUBLISHED' AND application_deadline > CURRENT_TIMESTAMP AND JSON_CONTAINS(benefits, JSON_ARRAY(:benefit))")
    Flux<Job> findByBenefits(String benefit);

    @Query("SELECT * FROM job where id = :id")
    Mono<Job> findByIdAndStatus(String id);

    @Query("UPDATE jobs SET views = views + 1 WHERE id = :id")
    Mono<Void> incrementJobViews(String id);

    @Query("UPDATE jobs SET applications = applications + 1 WHERE id = :id")
    Mono<Void> incrementJobApplications(String id);
}