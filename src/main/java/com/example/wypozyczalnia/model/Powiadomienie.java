package com.example.wypozyczalnia.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Powiadomienie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPowiadomienia;

    @ManyToOne
    @JoinColumn(name = "id_klienta", nullable = false)
    private Klient klient;

    @ManyToOne
    @JoinColumn(name = "id_wypozyczenia")
    private Wypozyczenie wypozyczenie;

    private String typ;

    @Column(columnDefinition = "TEXT")
    private String tresc;

    private LocalDateTime dataWyslania;

    private Boolean przeczytane = false;

    // Gettery i Settery
}
