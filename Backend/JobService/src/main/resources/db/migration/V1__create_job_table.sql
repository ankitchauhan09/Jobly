CREATE DATABASE IF NOT EXISTS job_profile_service_sih;

    CREATE TABLE job (

                         id VARCHAR(255) PRIMARY KEY,
                         title VARCHAR(255) NOT NULL,
                         description TEXT,
                         companyId VARCHAR(255),
                         min_salary DOUBLE,
                         max_salary DOUBLE,
                         location VARCHAR(255),
                         employment_type VARCHAR(50),
                         min_experience INT,
                         max_experience INT,
                         required_skills_json TEXT,
                         preferred_skills_json TEXT,
                         benefits_json TEXT,
                         workplace_type VARCHAR(50),
                         application_deadline TIMESTAMP,
                         status VARCHAR(20),
                         views BIGINT DEFAULT 0,
                         applications BIGINT DEFAULT 0,
                         industry_type VARCHAR(100),
                         department_name VARCHAR(100),
                         career_level VARCHAR(50),
                         education_level VARCHAR(100),
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         created_by VARCHAR(255)
    );

-- Create indexes for frequently queried columns
CREATE INDEX idx_job_title ON job (title);
CREATE INDEX idx_job_company ON job (company);
CREATE INDEX idx_job_location ON job (location);
CREATE INDEX idx_job_employment_type ON job (employment_type);
CREATE INDEX idx_job_workplace_type ON job (workplace_type);
CREATE INDEX idx_job_industry_type ON job (industry_type);
CREATE INDEX idx_job_career_level ON job (career_level);
CREATE INDEX idx_job_status ON job (status);
CREATE INDEX idx_job_created_at ON job (created_at);

-- Optional: Create a fulltext index for better text search performance
CREATE FULLTEXT INDEX idx_job_fulltext ON job (title, description, required_skills_json);