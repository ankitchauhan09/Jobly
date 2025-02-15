package com.companyservice.controller;

import com.companyservice.CompanyServiceApplication;
import com.companyservice.dto.CompanyDto;
import com.companyservice.service.CompaniesService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@Slf4j
@RequestMapping("/companies")
public class CompaniesController {

    @Autowired
    private CompaniesService companiesService;

    @PostMapping("/add")
    public Mono<CompanyDto> addNewCompany(@RequestBody CompanyDto companyDto) {
        log.info("received dto : {}", companyDto);
        return companiesService.addNewCompany(companyDto);
    }

    @GetMapping("/{id}")
    public Mono<CompanyDto> getCompanyById(@PathVariable String id) {
        return companiesService.getCompanyById(id);
    }

    @GetMapping("/all")
    public Flux<CompanyDto> getAllCompanies() {
        return companiesService.getAllCompanies();
    }

}
