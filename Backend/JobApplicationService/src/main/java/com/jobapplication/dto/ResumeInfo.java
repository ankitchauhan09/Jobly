package com.jobapplication.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResumeInfo {
    String resumeTitle;
    Long resumeSize;
    String resumeContentType;
    String resumeUrl;
}
