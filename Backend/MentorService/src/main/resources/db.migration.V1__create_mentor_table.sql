CREATE DATABASE IF NOT EXISTS mentor_service_sih;

CREATE TABLE mentors (
                         id VARCHAR(20) PRIMARY KEY,
                         first_name VARCHAR(100) NOT NULL,
                         last_name VARCHAR(100) NOT NULL,
                         email VARCHAR(255) NOT NULL UNIQUE,
                         profile_picture_url VARCHAR(500),
                         current_title VARCHAR(200),
                         location VARCHAR(200),
                         current_company VARCHAR(200),
                         years_of_experience INT,
                         timezone VARCHAR(50),

    -- JSON fields stored as TEXT
                         technical_skills TEXT NOT NULL DEFAULT '[]',
                         certifications TEXT NOT NULL DEFAULT '[]',
                         industry_domains TEXT NOT NULL DEFAULT '[]',
                         soft_skills TEXT NOT NULL DEFAULT '[]',
                         availability_schedule TEXT NOT NULL DEFAULT '[]',
                         mentoring_experience TEXT NOT NULL DEFAULT '{}',

                         average_rating DECIMAL(3,2),
                         total_reviews INT DEFAULT 0,
                         is_active BOOLEAN DEFAULT true,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Indexes
                         INDEX idx_email (email),
                         INDEX idx_company (current_company),
                         INDEX idx_experience (years_of_experience),
                         INDEX idx_rating (average_rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;