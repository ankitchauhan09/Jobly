package com.sih.hexstar.user.entities;

import com.sih.hexstar.user.payloads.Education;
import com.sih.hexstar.user.payloads.SkillPayload;
import com.sih.hexstar.user.payloads.SocialLinks;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.List;

@Data
@Table(name = "users")
public class User {
    @Id
    private String id;
    @Column("name")
    private String name;
    @Column("email")
    private String email;
    @Column("description")
    private String description;
    @Column("password")
    @Transient
    private String password;
    @Column("contact")
    private String contact;
    @Column("role_name")
    private String roleName;
    @Column("address")
    private String address;
    @Column("socialLinks")
    private String socialLinks;
    @Column("skills")
    private String skills;
    @Column("educations")
    private String educations;
    @Column("profile_pic_url")
    private String profilePicUrl;
}
