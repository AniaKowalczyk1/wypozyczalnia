package com.example.wypozyczalnia.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "pracownik")
public class Pracownik {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imie;

    @Column(nullable = false)
    private String nazwisko;

    private String rola;

    @ManyToOne
    @JoinColumn(name = "id_filii", nullable = false)
    private Filia filia;

    @OneToOne(mappedBy = "pracownik")
    private Konto konto;

    public Pracownik() {}

    public Pracownik(String imie, String nazwisko, String rola, Filia filia) {
        this.imie = imie;
        this.nazwisko = nazwisko;
        this.rola = rola;
        this.filia = filia;
    }

    // Gettery i Settery
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getImie() { return imie; }
    public void setImie(String imie) { this.imie = imie; }

    public String getNazwisko() { return nazwisko; }
    public void setNazwisko(String nazwisko) { this.nazwisko = nazwisko; }

    public String getRola() { return rola; }
    public void setRola(String rola) { this.rola = rola; }

    public Filia getFilia() { return filia; }
    public void setFilia(Filia filia) { this.filia = filia; }

    public Konto getKonto() { return konto; }
    public void setKonto(Konto konto) { this.konto = konto; }
}
