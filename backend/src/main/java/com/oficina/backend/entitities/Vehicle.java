package com.oficina.backend.entitities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String marca;
    private String modelo;
    private String ano;
    private String placa;

    @Column(name = "numero_chassi")
    private String numeroChassi;
    private String cor;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

}
