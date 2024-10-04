package com.oficina.backend.entitities;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.ToString.Exclude;

@Table(name = "users", schema = "public")
@Entity(name = "User")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ToString.Exclude
    private Long id;

    @Column(unique = true)
    private String email;

    @Exclude
    @JsonIgnore
    private String password;

    private String nome;

    private String cpf;

    @OneToMany(mappedBy = "user")
    @JsonBackReference
    private List<UserRole> userRoles;
    
}
