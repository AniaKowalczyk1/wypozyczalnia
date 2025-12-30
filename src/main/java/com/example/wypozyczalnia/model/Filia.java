package com.example.wypozyczalnia.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "filia")
public class Filia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nazwa;

    @Column(length = 255)
    private String adres;

    @Column(length = 20)
    private String telefon;

    @Column(length = 100)
    private String email;

    @OneToMany(mappedBy = "filia", cascade = CascadeType.ALL)
    private List<Pracownik> pracownicy;

    @OneToMany(mappedBy = "filia", cascade = CascadeType.ALL)
    private List<Egzemplarz> egzemplarze;

    public Filia() {}

    // Gettery i Settery
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNazwa() { return nazwa; }
    public void setNazwa(String nazwa) { this.nazwa = nazwa; }

    public String getAdres() { return adres; }
    public void setAdres(String adres) { this.adres = adres; }

    public String getTelefon() { return telefon; }
    public void setTelefon(String telefon) { this.telefon = telefon; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public List<Pracownik> getPracownicy() { return pracownicy; }
    public void setPracownicy(List<Pracownik> pracownicy) { this.pracownicy = pracownicy; }

    public List<Egzemplarz> getEgzemplarze() { return egzemplarze; }
    public void setEgzemplarze(List<Egzemplarz> egzemplarze) { this.egzemplarze = egzemplarze; }
}
