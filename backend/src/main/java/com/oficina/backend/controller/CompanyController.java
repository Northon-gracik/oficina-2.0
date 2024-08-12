package com.oficina.backend.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oficina.backend.dto.CompanyDto;
import com.oficina.backend.dto.CompanyLoginDTO;
import com.oficina.backend.dto.RecoveryJwtTokenDto;
import com.oficina.backend.entitities.Company;
import com.oficina.backend.services.CompanyService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/companies")
public class CompanyController {
    @Autowired
    CompanyService companyService;

    @PostMapping("/create")
    public ResponseEntity<?> createCompany(@RequestBody CompanyDto company, @RequestAttribute("authenticatedCompany") Optional<Company> authenticatedCompany) {
        try {
            var companyCreated = companyService.createCompany(company);

            return new ResponseEntity<>(companyCreated, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
        
    }
    
    @GetMapping("/recovery")
    public ResponseEntity<?> recoveyCompany(@RequestAttribute("authenticatedCompany") Optional<Company> authenticatedCompany) {
        try {
            var companyCreated = companyService.recoveryCompany(authenticatedCompany);

            return new ResponseEntity<>(companyCreated, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
        
    }

    @PostMapping("/login")
    public ResponseEntity<?> getMethodName(@RequestBody CompanyLoginDTO company) {
        try {
            System.out.println("tokenCompany");
            RecoveryJwtTokenDto tokenCompany = companyService.loginCompany(company.nome());

            return new ResponseEntity<>(tokenCompany, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }
}
