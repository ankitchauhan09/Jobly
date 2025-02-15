package com.mentorship.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mentorship.dto.MentorDto;
import com.mentorship.entities.Certificates;
import com.mentorship.entities.Mentor;

import java.util.List;

public class CustomModelMapper {

    private static ObjectMapper objectMapper = new ObjectMapper();

    public static Mentor toEntity(MentorDto dto) {
        if (dto == null) return null;
        try {

            Mentor mentor = new Mentor();
            mentor.setId(dto.getId());
            mentor.setName(dto.getName());
            mentor.setLocation(dto.getLocation());
            mentor.setTitle(dto.getTitle());
            mentor.setEmail(dto.getEmail());
            mentor.setDescription(dto.getDescription());
            mentor.setLanguages(dto.getLanguages());
            mentor.setIsActive(dto.getIsActive());
            mentor.setYearsOfExperience(dto.getYearsOfExperience());
            mentor.setIsVerified(dto.getIsVerified());
            mentor.setProfilePictureUrl(dto.getProfilePictureUrl());
            mentor.setRating(dto.getRating());
            if (dto.getAvailableSlots() != null) {
                String availableSlots = objectMapper.writeValueAsString(dto.getAvailableSlots());
                mentor.setAvailableSlots(availableSlots);
            }
            if (dto.getQualifications() != null) {
                String qualifications = objectMapper.writeValueAsString(dto.getQualifications());
                mentor.setQualifications(qualifications);
            }
            if (dto.getCertificates() != null) {
                String certificates = objectMapper.writeValueAsString(dto.getCertificates());
                mentor.setCertificates(certificates);
            }
            if (dto.getTechnicalSkills() != null) {
                String technicalSkills = objectMapper.writeValueAsString(dto.getTechnicalSkills());
                mentor.setTechnicalSkills(technicalSkills);
            }
            // Handle availability status
            if (dto.getAvailabilityStatus() != null) {
                mentor.setAvailabilityStatus(dto.getAvailabilityStatus().name());
            } else {
                mentor.setAvailabilityStatus(null); // or set a default value if applicable
            }
            return mentor;
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    public static MentorDto toDto(Mentor mentor) {
        if (mentor == null) return null;
        try {
            MentorDto mentorDto = new MentorDto();
            mentorDto.setId(mentor.getId());
            mentorDto.setName(mentor.getName());
            mentorDto.setEmail(mentor.getEmail());
            mentorDto.setTitle(mentor.getTitle());
            mentorDto.setYearsOfExperience(mentor.getYearsOfExperience());
            mentorDto.setLocation(mentor.getLocation());
// Handle availability status
            if (mentor.getAvailabilityStatus() != null) {
                mentorDto.setAvailabilityStatus(AvailabilityStatus.valueOf(mentor.getAvailabilityStatus()));
            } else {
                mentorDto.setAvailabilityStatus(null); // or handle default
            }
            mentorDto.setDescription(mentor.getDescription());
            mentorDto.setLanguages(mentor.getLanguages());
            mentorDto.setIsActive(mentor.getIsActive());
            mentorDto.setIsVerified(mentor.getIsVerified());
            mentorDto.setProfilePictureUrl(mentor.getProfilePictureUrl());
            mentorDto.setRating(mentor.getRating());
            if (mentor.getAvailableSlots() != null) {
                List<String> availabilitySlots = objectMapper.readValue(mentor.getAvailableSlots(), new TypeReference<List<String>>() {
                });
                mentorDto.setAvailableSlots(availabilitySlots);
            }
            if (mentor.getCertificates() != null) {
                List<Certificates> certificates = objectMapper.readValue(mentor.getCertificates(), new TypeReference<List<Certificates>>() {
                });
                mentorDto.setCertificates(certificates);
            }

            if (mentor.getQualifications() != null) {
                List<String> qualifications = objectMapper.readValue(mentor.getQualifications(), new TypeReference<List<String>>() {
                });
                mentorDto.setQualifications(qualifications);
            }
            if(mentor.getTechnicalSkills() != null) {
                List<String> technicalSkills = objectMapper.readValue(mentor.getTechnicalSkills(), new TypeReference<List<String>>() {
                });
                mentorDto.setTechnicalSkills(technicalSkills);
            }

            return mentorDto;
        } catch (JsonProcessingException e) {
            return null;
        }
    }

}
