package com.example.wypozyczalnia.dto;

import java.time.LocalDate;

public class KaraDto {

    private Long idWypozyczenia;
    private String tytul;
    private LocalDate terminZwrotu;
    private Integer dniSpoznienia;
    private Double kwotaCalkowita;
    private Boolean oplacone;

    // Gettery i settery
    public Long getIdWypozyczenia() { return idWypozyczenia; }
    public void setIdWypozyczenia(Long idWypozyczenia) { this.idWypozyczenia = idWypozyczenia; }

    public String getTytul() { return tytul; }
    public void setTytul(String tytul) { this.tytul = tytul; }

    public LocalDate getTerminZwrotu() { return terminZwrotu; }
    public void setTerminZwrotu(LocalDate terminZwrotu) { this.terminZwrotu = terminZwrotu; }

    public Integer getDniSpoznienia() { return dniSpoznienia; }
    public void setDniSpoznienia(Integer dniSpoznienia) { this.dniSpoznienia = dniSpoznienia; }

    public Double getKwotaCalkowita() { return kwotaCalkowita; }
    public void setKwotaCalkowita(Double kwotaCalkowita) { this.kwotaCalkowita = kwotaCalkowita; }

    public Boolean getOplacone() { return oplacone; }
    public void setOplacone(Boolean oplacone) { this.oplacone = oplacone; }
}
