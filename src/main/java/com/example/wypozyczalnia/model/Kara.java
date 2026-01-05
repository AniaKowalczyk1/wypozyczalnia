package com.example.wypozyczalnia.model;

import jakarta.persistence.*;

@Entity
public class Kara {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idKary;

    private Integer dniSpoznienia;
    private Double kwotaZaDzien;
    private Double kwotaCalkowita;
    private Boolean oplacone = false;

    @OneToOne
    @JoinColumn(name = "id_wypozyczenia", nullable = false, unique = true)
    private Wypozyczenie wypozyczenie;

    // Gettery i Settery
    public Long getIdKary() { return idKary; }
    public void setIdKary(Long idKary) { this.idKary = idKary; }

    public Integer getDniSpoznienia() { return dniSpoznienia; }
    public void setDniSpoznienia(Integer dniSpoznienia) { this.dniSpoznienia = dniSpoznienia; }

    public Double getKwotaZaDzien() { return kwotaZaDzien; }
    public void setKwotaZaDzien(Double kwotaZaDzien) { this.kwotaZaDzien = kwotaZaDzien; }

    public Double getKwotaCalkowita() { return kwotaCalkowita; }
    public void setKwotaCalkowita(Double kwotaCalkowita) { this.kwotaCalkowita = kwotaCalkowita; }

    public Boolean getOplacone() { return oplacone; }
    public void setOplacone(Boolean oplacone) { this.oplacone = oplacone; }

    public Wypozyczenie getWypozyczenie() { return wypozyczenie; }
    public void setWypozyczenie(Wypozyczenie wypozyczenie) { this.wypozyczenie = wypozyczenie; }
}
