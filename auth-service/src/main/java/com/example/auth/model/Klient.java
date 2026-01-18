package com.example.auth.model;

import jakarta.persistence.*;

@Entity
public class Klient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idKlienta;

    @Column(nullable = false)
    private String imie;

    @Column(nullable = false)
    private String nazwisko;

    @Column
    private String adres;

    @OneToOne(mappedBy = "klient")
    private Konto konto;

    // Gettery i Settery
    public Long getIdKlienta() { return idKlienta; }
    public void setIdKlienta(Long idKlienta) { this.idKlienta = idKlienta; }

    public String getImie() { return imie; }
    public void setImie(String imie) { this.imie = imie; }

    public String getNazwisko() { return nazwisko; }
    public void setNazwisko(String nazwisko) { this.nazwisko = nazwisko; }

    public String getAdres() { return adres; }
    public void setAdres(String adres) { this.adres = adres; }

    public Konto getKonto() { return konto; }
    public void setKonto(Konto konto) { this.konto = konto; }
}
