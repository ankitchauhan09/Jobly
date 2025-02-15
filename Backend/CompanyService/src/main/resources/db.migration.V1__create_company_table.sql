CREATE DATABASE IF NOT EXISTS company_service_sih;

create table companies(
    id VARCHAR(20) PRIMARY KEY ,
    companyName VARCHAR(50) NOT NULL,
    companyDescription VARCHAR(2000) NOT NULL ,
    companyLogoUrl VARCHAR(200) NOT NULL,
    companyLocation VARCHAR(50),
    noOfEmployees INTEGER,
    noOfVacancies INTEGER DEFAULT 0
);