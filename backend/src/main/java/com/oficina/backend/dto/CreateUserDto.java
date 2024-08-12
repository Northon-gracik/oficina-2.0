package com.oficina.backend.dto;

public record CreateUserDto(
        String email,
        String password,
        String nome,
        String cpf
) {
}
