package com.jobapplication.entities;

import lombok.Data;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;
import java.time.LocalDateTime;

@Table(name = "jobApplication")
@Data
@ToString
public class JobApplication {
    @Id
    @Column("id")
    private String id;

    @Column("firstName")
    private String firstName;

    @Column("lastName")
    private String lastName;

    @Column("jobId")
    private String jobId;

    @Column("email")
    private String email;

    @Column("contact")
    private String contact;

    @Column("currentCompanyName")
    private String currentCompanyName;

    @Column("currentRole")
    private String currentRole;

    @Column("yearsOfExperience")
    private String yearsOfExperience;

    @Column("linkedInProfileUrl")
    private String linkedInProfileUrl;

    @Column("portfolioUrl")
    private String portfolioUrl;

    @Column("coverLetter")
    private String coverLetter;

    @Column("dateOfApply")
    private LocalDateTime dateOfApply;

    @Column("userId")
    private String userId;

    @Column("resumeUrl")
    private String resumeUrl;

    // Constructor to set default dateOfApply
    public JobApplication() {
        this.dateOfApply = LocalDateTime.now();
    }
}