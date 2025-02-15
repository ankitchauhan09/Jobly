package com.companyservice.util;

import com.companyservice.dto.CompanyDto;
import com.companyservice.entities.Company;

public class CustomModalMapper {

    public static CompanyDto convertToDto(Company company) {
        CompanyDto companyDto = new CompanyDto();
        companyDto.setId(company.getId());
        companyDto.setCompanyName(company.getCompanyName());
        companyDto.setCompanyDescription(company.getCompanyDescription());
        companyDto.setCompanyLogoUrl(company.getCompanyLogoUrl());
        companyDto.setNoOfEmployees(company.getNoOfEmployees());
        companyDto.setNoOfVacancies(company.getNoOfVacancies());
        companyDto.setCompanyLocation(company.getCompanyLocation());
        return companyDto;
    }

    public static Company convertToEntity(CompanyDto companyDto) {
        Company company = new Company();
        company.setId(companyDto.getId());
        company.setCompanyName(companyDto.getCompanyName());
        company.setCompanyDescription(companyDto.getCompanyDescription());
        company.setCompanyLogoUrl(companyDto.getCompanyLogoUrl());
        company.setNoOfEmployees(companyDto.getNoOfEmployees());
        company.setCompanyLocation(companyDto.getCompanyLocation());
        company.setNoOfVacancies(companyDto.getNoOfVacancies());
        return company;
    }

}
