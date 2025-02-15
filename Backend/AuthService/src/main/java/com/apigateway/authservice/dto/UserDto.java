package com.apigateway.authservice.dto;

import com.apigateway.authservice.payload.Education;
import com.apigateway.authservice.payload.SkillPayload;
import com.apigateway.authservice.payload.SocialLinks;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
public class UserDto {
    private String id;
    private String name;
    private String email;
    private String contact;
    private String description;
    private String address;
    private String roleName;
    private List<SkillPayload> skills;
    private List<SocialLinks> socialLinks;
    private List<Education> educations;
    private String profilePicUrl;
}
