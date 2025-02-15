    package com.jobapplication.jobservice.entities;

    import com.fasterxml.jackson.core.JsonProcessingException;
    import com.fasterxml.jackson.core.type.TypeReference;
    import com.fasterxml.jackson.databind.ObjectMapper;
    import lombok.Data;
    import org.springframework.data.annotation.Id;
    import org.springframework.data.relational.core.mapping.Column;
    import org.springframework.data.relational.core.mapping.Table;

    import java.time.LocalDateTime;
    import java.util.ArrayList;
    import java.util.List;
    import java.util.UUID;

    @Table(name = "job")
    @Data
    public class Job {
        private static final ObjectMapper objectMapper = new ObjectMapper();
        @Id
        private String id;
        @Column("title")
        private String title;
        @Column("description")
        private String description;
        @Column("companyId")
        private String companyId    ;
        @Column("min_salary")
        private Double minSalary;
        @Column("max_salary")
        private Double maxSalary;
        @Column("location")
        private String location;
        @Column("employment_type")
        private String employmentType;
        @Column("min_experience")
        private Integer minExperience;
        @Column("max_experience")
        private Integer maxExperience;
        @Column("required_skills_json")
        private String requiredSkillsJson;
        @Column("preferred_skills_json")
        private String preferredSkillsJson;
        @Column("benefits_json")
        private String benefitsJson;
        @Column("workplace_type")
        private String workplaceType;
        @Column("application_deadline")
        private LocalDateTime applicationDeadline;
        private JobStatus status;
        private Long views;
        private Long applications;
        @Column("industry_type")
        private String industryType;
        @Column("department_name")
        private String departmentName;
        @Column("career_level")
        private String careerLevel;
        @Column("education_level")
        private String educationLevel;
        @Column("created_at")
        private LocalDateTime createdAt;
        @Column("updated_at")
        private LocalDateTime updatedAt;
        @Column("created_by")
        private String createdBy;

        public void setRequiredSkills(List<String> requiredSkills) {
            try {
                this.requiredSkillsJson = objectMapper.writeValueAsString(requiredSkills);
            } catch (JsonProcessingException e) {
                this.requiredSkillsJson = "[]";
            }
        }

        public List<String> getRequiredSkills() {
            try {
                return objectMapper.readValue(this.requiredSkillsJson, new TypeReference<List<String>>() {});
            } catch (JsonProcessingException e) {
                return new ArrayList<>();
            }
        }

        public Job() {
            this.id = UUID.randomUUID().toString();
        }

        public void setPreferredSkills(List<String> preferredSkills) {
            try {
                this.preferredSkillsJson = objectMapper.writeValueAsString(preferredSkills);
            } catch (JsonProcessingException e) {
                this.preferredSkillsJson = "[]";
            }
        }

        public List<String> getPreferredSkills() {
            try {
                return objectMapper.readValue(this.preferredSkillsJson, new TypeReference<List<String>>() {});
            } catch (JsonProcessingException e) {
                return new ArrayList<>();
            }
        }

        public void setBenefits(List<String> benefits) {
            try {
                this.benefitsJson = objectMapper.writeValueAsString(benefits);
            } catch (JsonProcessingException e) {
                this.benefitsJson = "[]";
            }
        }

        public List<String> getBenefits() {
            try {
                return objectMapper.readValue(this.benefitsJson, new TypeReference<List<String>>() {});
            } catch (JsonProcessingException e) {
                return new ArrayList<>();
            }
        }
    }