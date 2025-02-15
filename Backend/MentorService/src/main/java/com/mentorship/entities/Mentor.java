package com.mentorship.entities;

import lombok.Data;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "mentors")
@Data
@ToString
public class Mentor {
    @Id
    @Column("id")
    private String id;
    @Column("name")
    private String name;
    @Column("title")
    private String title;
    @Column("location")
    private String location;
    @Column("certificates")
    private String certificates;
    @Column("email")
    private String email;
    @Column("availabilityStatus")
    private String availabilityStatus;
    @Column("profilePictureUrl")
    private String profilePictureUrl;
    @Column("qualifications")
    private String qualifications;
    @Column("isActive")
    private Boolean isActive;
    @Column("description")
    private String description;
    @Column("rating")
    private Double rating;
    @Column("yearsOfExperience")
    private Integer yearsOfExperience;
    @Column("isVerified")
    private Boolean isVerified;
    @Column("technicalSkills")
    private String technicalSkills;
    @Column("languages")
    private String languages;
    @Column("availableSlots")
    private String availableSlots;
}
