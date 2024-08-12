package com.oficina.backend.dto;

import com.oficina.backend.entitities.Company;

public record ReturnCreateCompanyDto(
    String token,
    Company company
) {

}
