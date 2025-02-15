package com.jobapplication.jobservice.dto;

import com.jobapplication.jobservice.entities.JobStatus;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.hibernate.annotations.DiscriminatorFormula;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class JobDto {

    private String id;

    @NotBlank(message = "Job title is required")
    @Size(min = 3, max = 100)
    private String title;

    @NotBlank(message = "Job description is required")
    @Size(min = 20, max = 5000)
    private String description;

    @NotBlank(message = "Company id is required")
    private String companyId;

    @NotNull(message = "Minimum salary is required")
    @Min(value = 0)
    private Double minSalary;

    @NotNull(message = "Maximum salary is required")
    @Min(value = 0)
    private Double maxSalary;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Employment type is required")
    private String employmentType;

    @Min(value = 0)
    private Integer minExperience;

    @Min(value = 0)
    private Integer maxExperience;

    @NotEmpty(message = "At least one required skill must be specified")
    private List<String> requiredSkills;

    private List<String> preferredSkills;

    private List<String> benefits;

    @NotBlank(message = "Workplace type is required")
    private String workplaceType;

    @Future(message = "Application deadline must be in the future")
    private LocalDateTime applicationDeadline;

    @NotBlank(message = "Industry type is required")
    private String industryType;

    @NotBlank(message = "Department name is required")
    private String departmentName;

    @NotBlank(message = "Career level is required")
    private String careerLevel;

    @NotBlank(message = "Education level is required")
    private String educationLevel;
}
