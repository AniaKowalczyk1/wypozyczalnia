package com.example.wypozyczalnia.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
public class Wypozyczenie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idWypozyczenia;

    private LocalDate dataWypozyczenia;
    private LocalDate terminZwrotu;
    private LocalDate dataZwrotu;

    @ManyToOne
    @JoinColumn(name = "id_pracownika")
    private Pracownik pracownik;

    @ManyToOne
    @JoinColumn(name = "id_klienta", nullable = false)
    private Klient klient;

    @ManyToOne
    @JoinColumn(name = "id_filii", nullable = false)
    private Filia filia;

    @ManyToMany
    @JoinTable(
            name = "Wypozyczenie_Egzemplarz",
            joinColumns = @JoinColumn(name = "id_wypozyczenia"),
            inverseJoinColumns = @JoinColumn(name = "id_egzemplarza")
    )
    private List<Egzemplarz> egzemplarze;

    @OneToOne(mappedBy = "wypozyczenie", cascade = CascadeType.ALL)
    private Platnosc platnosc;

    @OneToOne(mappedBy = "wypozyczenie", cascade = CascadeType.ALL)
    private Kara kara;

    @OneToMany(mappedBy = "wypozyczenie")
    private List<Powiadomienie> powiadomienia;

    // Gettery i Settery
}
