package com.example.auth.model;

import jakarta.persistence.*;

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

    @Column(name = "id_filii", nullable = false)
    private Long idFilii;

    @OneToOne(mappedBy = "pracownik")
    private Konto konto;

    public Pracownik() {}

    public Pracownik(String imie, String nazwisko, String rola) {
        this.imie = imie;
        this.nazwisko = nazwisko;
        this.rola = rola;
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

    public Long getFilia() { return idFilii; }
    public void setFilia(Long idFilii) { this.idFilii = idFilii; }

    public Konto getKonto() { return konto; }
    public void setKonto(Konto konto) { this.konto = konto; }
}
