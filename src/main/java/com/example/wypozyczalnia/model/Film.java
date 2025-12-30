package com.example.wypozyczalnia.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Film {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFilmu;

    private String tytul;
    private String gatunek;

    @Column(name = "rok_wydania")
    private Integer rokWydania;

    private String rezyser;

    @Column(columnDefinition = "TEXT")
    private String opis;

    @OneToMany(mappedBy = "film")
    private List<Egzemplarz> egzemplarze;

    // Gettery i Settery
}
