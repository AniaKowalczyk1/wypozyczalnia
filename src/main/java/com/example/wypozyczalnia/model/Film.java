package com.example.wypozyczalnia.model;

import jakarta.persistence.*;

@Entity
@Table(name = "film")
public class Film {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tytul;
    private String opis;
    private String gatunek;
    private int rok;

    @Column(name = "dostepne_kopie")
    private int dostepneKopie;

    // Konstruktor bezargumentowy (wymagany przez JPA)
    public Film() {}

    // Konstruktor wygodny
    public Film(String tytul, String opis, String gatunek, int rok, int dostepneKopie) {
        this.tytul = tytul;
        this.opis = opis;
        this.gatunek = gatunek;
        this.rok = rok;
        this.dostepneKopie = dostepneKopie;
    }

    // Gettery i Settery
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTytul() { return tytul; }
    public void setTytul(String tytul) { this.tytul = tytul; }

    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }

    public String getGatunek() { return gatunek; }
    public void setGatunek(String gatunek) { this.gatunek = gatunek; }

    public int getRok() { return rok; }
    public void setRok(int rok) { this.rok = rok; }

    public int getDostepneKopie() { return dostepneKopie; }
    public void setDostepneKopie(int dostepneKopie) { this.dostepneKopie = dostepneKopie; }
}
