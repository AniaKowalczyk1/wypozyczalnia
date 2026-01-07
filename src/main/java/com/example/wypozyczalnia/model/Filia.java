package com.example.wypozyczalnia.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Filia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFilii;

    private String nazwa;
    private String adres;
    private String telefon;
    private String email;

    @JsonIgnore
    @OneToMany(mappedBy = "filia", cascade = CascadeType.ALL)
    private List<Egzemplarz> egzemplarze = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "filia")
    private List<Wypozyczenie> wypozyczenia = new ArrayList<>();

    // Gettery i Settery
    public Long getIdFilii() { return idFilii; }
    public void setIdFilii(Long idFilii) { this.idFilii = idFilii; }

    public String getNazwa() { return nazwa; }
    public void setNazwa(String nazwa) { this.nazwa = nazwa; }

    public String getAdres() { return adres; }
    public void setAdres(String adres) { this.adres = adres; }

    public String getTelefon() { return telefon; }
    public void setTelefon(String telefon) { this.telefon = telefon; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public List<Egzemplarz> getEgzemplarze() { return egzemplarze; }
    public void setEgzemplarze(List<Egzemplarz> egzemplarze) { this.egzemplarze = egzemplarze; }

    public List<Wypozyczenie> getWypozyczenia() { return wypozyczenia; }
    public void setWypozyczenia(List<Wypozyczenie> wypozyczenia) { this.wypozyczenia = wypozyczenia; }
}
