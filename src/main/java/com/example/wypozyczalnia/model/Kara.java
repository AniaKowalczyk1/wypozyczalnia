package com.example.wypozyczalnia.model;

import jakarta.persistence.*;

@Entity
public class Kara {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idKary;

    private Integer dniSpoznienia;
    private Double kwotaZaDzien;
    private Double kwotaCalkowita;
    private Boolean oplacone = false;

    @OneToOne
    @JoinColumn(name = "id_wypozyczenia", nullable = false, unique = true)
    private Wypozyczenie wypozyczenie;

    // Gettery i Settery
}
