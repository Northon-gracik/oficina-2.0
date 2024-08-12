package com.oficina.backend.services;

import com.oficina.backend.dto.CreateUserDto;
import com.oficina.backend.dto.LoginUserDto;
import com.oficina.backend.dto.RecoveryJwtTokenDto;
import com.oficina.backend.dto.RecoveryUserDto;
import com.oficina.backend.entitities.Company;
import com.oficina.backend.entitities.User;
import com.oficina.backend.entitities.UserRole;
import com.oficina.backend.repositories.UserRepository;
import com.oficina.backend.repositories.UserRoleRepository;
import com.oficina.backend.security.authentication.JwtTokenService;
import com.oficina.backend.security.config.SecurityConfiguration;
import com.oficina.backend.security.userdetails.UserDetailsImpl;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenService jwtTokenService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private SecurityConfiguration securityConfiguration;

    // Método responsável por autenticar um usuário e retornar um token JWT
    public RecoveryJwtTokenDto authenticateUser(LoginUserDto loginUserDto) throws Exception{
        Optional<User> userOptional = userRepository.findByEmail(loginUserDto.email());

        if(userOptional.isEmpty()){
            throw new Exception("User not exists");
        }
        // Cria um objeto de autenticação com o email e a senha do usuário
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(loginUserDto.email(), loginUserDto.password());

        // Autentica o usuário com as credenciais fornecidas
        Authentication authentication = authenticationManager.authenticate(usernamePasswordAuthenticationToken);

        // Obtém o objeto UserDetails do usuário autenticado
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // Gera um token JWT para o usuário autenticado
       return new RecoveryJwtTokenDto(jwtTokenService.generateToken(userDetails.getUser().getEmail()));
    }

    // Método responsável por criar um usuário
    public RecoveryJwtTokenDto createUser(CreateUserDto createUserDto) throws Exception{
        Optional<User> isExistUser = userRepository.findByEmail(createUserDto.email());

        if(isExistUser.isPresent()){
            System.out.println(isExistUser.get().toString());
            throw new Exception("User already exists");
        }

        // Cria um novo usuário com os dados fornecidos
        User newUser = User.builder()
                .email(createUserDto.email())
                // Codifica a senha do usuário com o algoritmo bcrypt
                .password(securityConfiguration.passwordEncoder().encode(createUserDto.password()))
                // Atribui ao usuário uma permissão específica
                // .roles(List.of(Role.builder().name(createUserDto.role()).build()))
                .cpf(createUserDto.cpf())
                .nome(createUserDto.nome())
                .build();

        // Salva o novo usuário no banco de dados
        userRepository.save(newUser);

        LoginUserDto userLogin = new LoginUserDto(newUser.getEmail(), createUserDto.password());
        RecoveryJwtTokenDto token = this.authenticateUser(userLogin);
        return token;
    }

    public RecoveryUserDto userRecovery() throws Exception {
        return userRecovery(Optional.empty());
    }

    public RecoveryUserDto userRecovery( Optional<Company> company) throws Exception {
        User getUser = this.userRecoveryEntity();

        if(company.isPresent()){
            return new RecoveryUserDto(getUser.getId(), getUser.getEmail(), getUser.getCpf(), getUser.getNome(), getUser.getUserRoles(), company.get());

        }

        return new RecoveryUserDto(getUser.getId(), getUser.getEmail(), getUser.getCpf(), getUser.getNome(), getUser.getUserRoles(), null);
    }

    public User userRecoveryEntity() throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Optional<User> userOptional = userRepository.findByEmail(authentication.getPrincipal().toString());

        if(userOptional.isPresent()){
            return userOptional.get();           

        }
        throw new Exception("User not exists");
    }
}
