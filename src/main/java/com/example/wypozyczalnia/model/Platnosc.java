package com.example.wypozyczalnia.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Platnosc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPlatnosci;

    private Double kwota;
    private LocalDate dataPlatnosci;
    private String metoda;

    @OneToOne
    @JoinColumn(name = "id_wypozyczenia", nullable = false, unique = true)
    private Wypozyczenie wypozyczenie;

    // Gettery i Settery
}
