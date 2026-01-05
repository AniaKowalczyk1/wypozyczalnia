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
    public Long getIdPowiadomienia() {
        return idPowiadomienia;
    }

    public void setIdPowiadomienia(Long idPowiadomienia) {
        this.idPowiadomienia = idPowiadomienia;
    }

    public Klient getKlient() {
        return klient;
    }

    public void setKlient(Klient klient) {
        this.klient = klient;
    }

    public Wypozyczenie getWypozyczenie() {
        return wypozyczenie;
    }

    public void setWypozyczenie(Wypozyczenie wypozyczenie) {
        this.wypozyczenie = wypozyczenie;
    }

    public String getTyp() {
        return typ;
    }

    public void setTyp(String typ) {
        this.typ = typ;
    }

    public String getTresc() {
        return tresc;
    }

    public void setTresc(String tresc) {
        this.tresc = tresc;
    }

    public LocalDateTime getDataWyslania() {
        return dataWyslania;
    }

    public void setDataWyslania(LocalDateTime dataWyslania) {
        this.dataWyslania = dataWyslania;
    }

    public Boolean getPrzeczytane() {
        return przeczytane;
    }

    public void setPrzeczytane(Boolean przeczytane) {
        this.przeczytane = przeczytane;
    }
}
