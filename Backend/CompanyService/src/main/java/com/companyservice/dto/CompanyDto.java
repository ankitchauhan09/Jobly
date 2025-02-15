package com.companyservice.dto;

import lombok.Data;
import lombok.ToString;

@ToString
@Data
public class CompanyDto{
    private String id;
    private String companyName;
    private String companyDescription;
    private String companyLogoUrl;
    private String companyLocation;
    private Integer noOfEmployees;
    private Integer noOfVacancies;
}
