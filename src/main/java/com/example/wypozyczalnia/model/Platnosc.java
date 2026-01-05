package com.example.wypozyczalnia.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
public class Platnosc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPlatnosci;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal kwota;

    @Column(nullable = false)
    private LocalDate dataPlatnosci;

    @Column(nullable = false)
    private String metoda;

    @OneToOne
    @JoinColumn(name = "id_wypozyczenia", nullable = false, unique = true)
    private Wypozyczenie wypozyczenie;

    // Gettery i Settery
    public Long getIdPlatnosci() {
        return idPlatnosci;
    }

    public void setIdPlatnosci(Long idPlatnosci) {
        this.idPlatnosci = idPlatnosci;
    }

    public BigDecimal getKwota() {
        return kwota;
    }

    public void setKwota(BigDecimal kwota) {
        this.kwota = kwota;
    }

    public LocalDate getDataPlatnosci() {
        return dataPlatnosci;
    }

    public void setDataPlatnosci(LocalDate dataPlatnosci) {
        this.dataPlatnosci = dataPlatnosci;
    }

    public String getMetoda() {
        return metoda;
    }

    public void setMetoda(String metoda) {
        this.metoda = metoda;
    }

    public Wypozyczenie getWypozyczenie() {
        return wypozyczenie;
    }

    public void setWypozyczenie(Wypozyczenie wypozyczenie) {
        this.wypozyczenie = wypozyczenie;
    }
}
