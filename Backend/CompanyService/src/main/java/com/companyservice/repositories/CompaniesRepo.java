package com.companyservice.repositories;

import com.companyservice.entities.Company;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface CompaniesRepo extends R2dbcRepository<Company, String> {

    @Query("INSERT INTO companies (id, companyName, companyDescription, companyLogoUrl, noOfEmployees, noOfVacancies) VALUES (:#{#company.id}, :#{#company.companyName}, :#{#company.companyDescription}, :#{#company.companyLogoUrl}, :#{#company.noOfEmployees}, :#{#company.noOfVacancies})")
    Mono<Company> save(Company company);

}
