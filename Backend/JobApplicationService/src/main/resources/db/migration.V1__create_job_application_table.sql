CREATE DATABASE IF NOT EXISTS job_application_service_sih;

CREATE TABLE IF NOT EXISTS jobApplication (
    id VARCHAR(244) PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100),
    jobId VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contact VARCHAR(10),
    currentCompanyName VARCHAR(100),
    currentRole VARCHAR(100),
    yearsOfExperience VARCHAR(10),
    linkedInProfileUrl VARCHAR(255),
    portfolioUrl VARCHAR(255),
    coverLetter TEXT,
    dateOfApply DATETIME DEFAULT CURRENT_TIMESTAMP,
    userId VARCHAR(50),
    resumeUrl VARCHAR(255),
    INDEX idx_userId (userId)
    );