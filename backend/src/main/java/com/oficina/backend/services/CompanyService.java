package com.oficina.backend.services;

import java.util.Optional;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.oficina.backend.dto.CompanyDto;
import com.oficina.backend.dto.RecoveryJwtTokenDto;
import com.oficina.backend.dto.ReturnCreateCompanyDto;
import com.oficina.backend.entitities.Company;
import com.oficina.backend.entitities.User;
import com.oficina.backend.entitities.UserRole;
import com.oficina.backend.enums.RoleName;
import com.oficina.backend.repositories.CompanyRepository;
import com.oficina.backend.repositories.SchemaRepository;
import com.oficina.backend.repositories.UserRoleRepository;
import com.oficina.backend.security.authentication.JwtTokenService;

@Service
public class CompanyService {
    @Autowired
    private DataSource dataSource;

    @Autowired
    CompanyRepository companyRepository;

    @Autowired
    SchemaRepository schemaRepository;

    @Autowired
    UserRoleRepository userRoleRepository;

    @Autowired
    UserService userService;

    @Autowired
    JwtTokenService jwtTokenService;

    public ReturnCreateCompanyDto createCompany(CompanyDto createCompany) throws Exception {
        if(companyRepository.findByNome(createCompany.nome()).isPresent()){
            throw new Exception("Já existe empresa com esse nome.");
        }

        if(companyRepository.findByCnpj(createCompany.cnpj()).isPresent()){
            throw new Exception("Já existe empresa com esse cnpj.");
        }

        String schema = createCompany.nome().substring(0, 3) + "_" +
                createCompany.cnpj();

        Company newCompany = Company.builder()
                .cnpj(createCompany.cnpj())
                .nome(createCompany.nome())
                .schema(schema)
                .build();

        Company companySaved = companyRepository.save(newCompany);

        schemaRepository.save(schema);

        User userEntity = userService.userRecoveryEntity();

        UserRole newUserRole = UserRole.builder()
                .company(companySaved)
                .user(userEntity)
                .role(RoleName.ROLE_ADMINISTRATOR)
                .build();

        userRoleRepository.save(newUserRole);

        String token = jwtTokenService.generateToken(userEntity.getEmail(), companySaved.nome);

        return new ReturnCreateCompanyDto(token, companySaved);
    }

    public Company recoveryCompany(Optional<Company> companyOptional) throws Exception {

        if (companyOptional.isPresent()) {
            Company company = companyOptional.get();

            company.setUserRoles(userRoleRepository.findByCompany(companyOptional.get()));

            return company;
        }

        throw new Exception("Não foi encontrado empresa no token");
    }

    public RecoveryJwtTokenDto loginCompany(String companyName) throws Exception {

        Optional<Company> companyOptional = companyRepository.findByNome(companyName);

        if (companyOptional.isPresent()) {
            Company company = companyOptional.get();

            company.setUserRoles(userRoleRepository.findByCompany(companyOptional.get()));

            return new RecoveryJwtTokenDto(
                jwtTokenService.generateToken(userService.userRecoveryEntity().getEmail(), company.nome)
                );
        }

        throw new Exception("Não foi encontrado empresa pesquisada");
    }
}
