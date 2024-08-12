package com.oficina.backend.dto;

import java.util.List;

import com.oficina.backend.entitities.Company;
import com.oficina.backend.entitities.UserRole;

public record RecoveryUserDto(
        Long id,
        String email,
        String cpf,
        String nome,
        List<UserRole> roles,
        Company companyActive
        ) {
}
