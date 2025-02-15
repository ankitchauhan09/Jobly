package com.jobapplication.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@ToString
@AllArgsConstructor
public class JobApplicationDto {
    String id;
    String userId;
    String firstName;
    String lastName;
    String jobId;
    String email;
    String contact;
    String currentCompanyName;
    String currentRole;
    String yearsOfExperience;
    String linkedInProfileUrl;
    String portfolioUrl;
    String coverLetter;
    String resumeUrl;
}
