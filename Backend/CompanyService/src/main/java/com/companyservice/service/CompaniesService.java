package com.companyservice.service;

import com.companyservice.dto.CompanyDto;
import com.companyservice.repositories.CompaniesRepo;
import com.companyservice.util.CustomModalMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@Slf4j
public class CompaniesService {

    @Autowired
    private CompaniesRepo companiesRepo;

    public Mono<CompanyDto> addNewCompany(CompanyDto companyDto) {
        return Mono.just(companyDto)
                .map(CustomModalMapper::convertToEntity)
                .flatMap(company -> {
                    log.info("converted entity : {}", company);
                    return this.companiesRepo.save(company)
                            .then(Mono.just(company))
                            .doOnSuccess(savedCompany -> log.info("Company added successfully"))
                            .doOnError(error -> log.error("Error occurred while adding the company : {}", error.getMessage()));
                }).map(CustomModalMapper::convertToDto)
                .doOnSuccess(savedCompany -> log.debug("Company converted to DTO successfully. ID: {}, Title: {}", savedCompany.getId(), savedCompany.getCompanyName()))
                .doOnError(error -> log.error("Error adding company: ", error));
    }

    public Mono<CompanyDto> getCompanyById(String id) {
        return Mono.just(id)
                .flatMap(companyId -> {
                    return this.companiesRepo.findById(companyId)
                            .doOnSuccess(fetchedCompany -> log.info("Company fetched successfully with id : {}", fetchedCompany.getId()))
                            .doOnError(error -> log.error("Error occurred while fetching the company : {}", error.getMessage()));
                }).map(CustomModalMapper::convertToDto)
                .doOnSuccess(fetchedCompany -> log.info("Company converted to dto with id : {}", fetchedCompany.getId()))
                .doOnError(error -> log.error("Error while fetching the company : {}", error.getMessage()));
    }

    public Flux<CompanyDto> getAllCompanies() {
        return this.companiesRepo.findAll().map(CustomModalMapper::convertToDto)
                .doOnComplete(() -> log.info("All companies fetched successfully"))
                .doOnError(error -> log.error("Error occurred while fetching the all companies", error));
    }

}
