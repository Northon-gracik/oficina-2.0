package com.oficina.backend.entitities;

import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Table(name = "companies")
@Entity(name = "Company")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@ToString
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ToString.Exclude
    private Long id;

    public String nome;

    @Column(unique = true)
    public String cnpj;
    
    @Column(unique = true)
    public String schema;

    @OneToMany(mappedBy = "company")
    @JsonBackReference
    private List<UserRole> userRoles;
}