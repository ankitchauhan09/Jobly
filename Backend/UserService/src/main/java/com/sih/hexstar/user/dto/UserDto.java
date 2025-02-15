package com.sih.hexstar.user.dto;

import com.sih.hexstar.user.payloads.Education;
import com.sih.hexstar.user.payloads.SkillPayload;
import com.sih.hexstar.user.payloads.SocialLinks;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Data
public class UserDto {
    private String id;
    private String name;
    private String email;
    private String contact;
    private String description;
    private String address;
    private String roleName;
    private List<SkillPayload> skills;
    private List<Education> educations;
    private String profilePicUrl;
    private List<SocialLinks> socialLinks;
}
