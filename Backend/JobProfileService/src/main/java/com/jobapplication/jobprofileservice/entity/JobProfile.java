package com.jobapplication.jobprofileservice.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table("job_profile")
public class JobProfile {
    @Id
    private Integer id;
    private String profileName;
}
