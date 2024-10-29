package com.oficina.backend.security.config;

import com.oficina.backend.security.authentication.UserAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    @Autowired
    private UserAuthenticationFilter userAuthenticationFilter;

    // Endpoints que não requerem autenticação
    public static final String[] PUBLIC_ENDPOINTS = {
        "/users/login", // Url que usaremos para fazer login
        "/users" // Url que usaremos para criar um usuário
    };

    // Endpoints que requerem autenticação para serem acessados
    private static final String[] AUTHENTICATED_ENDPOINTS = {
        "/users/test", "/users/recovery",
        "/companies/**",
        "/clients/**",
        "/vehicles/**",
        "/servicos/**"
    };

    // Endpoints que só podem ser acessados por usuários com permissão de cliente
    // private static final String[] CUSTOMER_ENDPOINTS = {
    //     "/users/test/customer"
    // };

    // Endpoints que só podem ser acessados por usuários com permissão de administrador
    // private static final String[] ADMIN_ENDPOINTS = {
    //     "/users/test/administrator"
    // };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
            .csrf(csrf -> csrf.disable()) // Desativa a proteção contra CSRF
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Configura a política de criação de sessão como stateless
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                .requestMatchers(AUTHENTICATED_ENDPOINTS).authenticated()
                // .requestMatchers(ADMIN_ENDPOINTS).hasRole("ADMINISTRATOR") // Repare que não é necessário colocar "ROLE" antes do nome, como fizemos na definição das roles
                // .requestMatchers(CUSTOMER_ENDPOINTS).hasRole("CUSTOMER")
                .anyRequest().denyAll()
            )
            // Adiciona o filtro de autenticação de usuário que criamos, antes do filtro de segurança padrão do Spring Security
            .addFilterBefore(userAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}