package com.oficina.backend.security.authentication;

import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.oficina.backend.entitities.User;
import com.oficina.backend.entitities.UserRole;
import com.oficina.backend.repositories.CompanyRepository;
import com.oficina.backend.repositories.UserRepository;
import com.oficina.backend.security.config.SecurityConfiguration;
import com.oficina.backend.security.userdetails.UserDetailsImpl;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;
import java.util.Set;
import java.util.HashSet;

@Component
public class UserAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenService jwtTokenService; // Service que definimos anteriormente

    @Autowired
    private UserRepository userRepository; // Repository que definimos anteriormente

    @Autowired 
    private CompanyRepository companyRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            // Verifica se o endpoint requer autenticação antes de processar a requisição
            if (checkIfEndpointIsNotPublic(request)) {
                String token = recoveryToken(request); // Recupera o token do cabeçalho Authorization da requisição
                if (token != null) {
                    processToken(token, request);
                } else {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"O token está ausente.\"}");
                    System.err.println("Erro: O token está ausente.");
                    return;
                }
            }
            filterChain.doFilter(request, response); // Continua o processamento da requisição
        } catch (JWTVerificationException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Erro ao validar token. " + e.getMessage() + "\"}");
            System.err.println("Erro: " + e.getMessage());
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Erro interno do servidor.\"}");
            System.err.println("Erro: " + e.getMessage());
        }
    }

    private void processToken(String token, HttpServletRequest request) {
        String subject = jwtTokenService.getSubjectFromToken(token); // Obtém o assunto (neste caso, o nome de usuário) do token
        Optional<User> userOptional = userRepository.findByEmail(subject); // Busca o usuário pelo email (que é o assunto do token)
        
        userOptional.ifPresent(user -> {
            UserDetailsImpl userDetails = new UserDetailsImpl(user); // Cria um UserDetails com o usuário encontrado

            // Cria um objeto de autenticação do Spring Security
            Authentication authentication =
                    new UsernamePasswordAuthenticationToken(userDetails.getUsername(), null, userDetails.getAuthorities());

            // Define o objeto de autenticação no contexto de segurança do Spring Security
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            var companyId = jwtTokenService.getCompanyId(token);
            
            if(companyId != null){
                companyRepository.findByIdWithUserRoles(companyId).ifPresent(company -> {
                    // Converte List<UserRole> para Set<UserRole>
                    Set<UserRole> userRolesSet = new HashSet<UserRole>(company.getUserRoles());
                    company.setUserRoles(userRolesSet);
                    request.setAttribute("authenticatedCompany", company);
                });
            }
        });
    }

    // Recupera o token do cabeçalho Authorization da requisição
    private String recoveryToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        return authorizationHeader != null ? authorizationHeader.replace("Bearer ", "") : null;
    }

    // Verifica se o endpoint requer autenticação antes de processar a requisição
    private boolean checkIfEndpointIsNotPublic(HttpServletRequest request) {
        String requestURI = request.getRequestURI();
        return !Arrays.asList(SecurityConfiguration.PUBLIC_ENDPOINTS).contains(requestURI);
    }
}
