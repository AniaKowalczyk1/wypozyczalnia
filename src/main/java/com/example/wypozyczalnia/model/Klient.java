package com.example.wypozyczalnia.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "klient")
public class Klient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imie;

    @Column(nullable = false)
    private String nazwisko;

    private String adres;

    @OneToOne(mappedBy = "klient")
    private Konto konto;

    public Klient() {}

    public Klient(String imie, String nazwisko, String adres) {
        this.imie = imie;
        this.nazwisko = nazwisko;
        this.adres = adres;
    }

    // Gettery i Settery
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getImie() { return imie; }
    public void setImie(String imie) { this.imie = imie; }

    public String getNazwisko() { return nazwisko; }
    public void setNazwisko(String nazwisko) { this.nazwisko = nazwisko; }

    public String getAdres() { return adres; }
    public void setAdres(String adres) { this.adres = adres; }

    public Konto getKonto() { return konto; }
    public void setKonto(Konto konto) { this.konto = konto; }
}
