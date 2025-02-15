package com.mentorship.dto;

import com.mentorship.entities.Certificates;
import com.mentorship.utils.AvailabilityStatus;
import lombok.Data;
import lombok.ToString;

import java.util.List;

@Data
@ToString
public class MentorDto {

        private String id;
        private String name;
        private String location;
        private String title;
        private List<Certificates> certificates;
        private String email;
        private AvailabilityStatus availabilityStatus;
        private String profilePictureUrl;
        private List<String> qualifications;
        private Boolean isActive;
        private String description;
        private Double rating;
        private Integer yearsOfExperience;
        private Boolean isVerified;
        private List<String> technicalSkills;
        private String languages;
        private List<String> availableSlots;

}
