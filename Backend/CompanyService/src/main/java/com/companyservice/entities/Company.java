package com.companyservice.entities;

import lombok.Data;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "companies")
@Data
@ToString
public class Company {
    @Id
    @Column("id")
    private String id;
    @Column("companyName")
    private String companyName;
    @Column("companyDescription")
    private String companyDescription;
    @Column("companyLogoUrl")
    private String companyLogoUrl;
    @Column("companyLocation")
    private String companyLocation;
    @Column("noOfEmployees")
    private Integer noOfEmployees;
    @Column("noOfVacancies")
    private Integer noOfVacancies;
}
