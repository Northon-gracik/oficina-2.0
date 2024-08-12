package com.oficina.backend.controller;

import com.oficina.backend.dto.CreateUserDto;
import com.oficina.backend.dto.LoginUserDto;
import com.oficina.backend.dto.RecoveryJwtTokenDto;
import com.oficina.backend.dto.RecoveryUserDto;
import com.oficina.backend.entitities.Company;
import com.oficina.backend.services.UserService;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody CreateUserDto createUserDto) {
        try {
            RecoveryJwtTokenDto token = userService.createUser(createUserDto);
            return new ResponseEntity<>(token, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginUserDto loginUserDto) {
        try {
            RecoveryJwtTokenDto token = userService.authenticateUser(loginUserDto);
            return new ResponseEntity<>(token, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/recovery")
    public ResponseEntity<?> userRecovery(
            @RequestAttribute("authenticatedCompany") Optional<Company> authenticatedCompany) {
        try {
            RecoveryUserDto user = userService.userRecovery(authenticatedCompany);

            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.toString(), HttpStatus.BAD_REQUEST);
        }
    }
}