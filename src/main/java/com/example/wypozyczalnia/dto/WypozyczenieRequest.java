package com.example.wypozyczalnia.dto;

import java.time.LocalDate;
import java.util.List;

public class WypozyczenieRequest {

    private Long idKonta;
    private Long idFilii;
    private String terminZwrotu;
    private List<Long> egzemplarzeId;

    private String dostawa;
    private String adresDostawy;

    // ===== Dodatkowe pola do wyświetlania =====
    private LocalDate dataWypozyczenia;
    private LocalDate dataZwrotu;
    private List<String> filmy;
    private String status;              // "AKTUALNE" lub "PRZESZŁE"

    // ===== Gettery i Settery =====
    public Long getIdKonta() { return idKonta; }
    public void setIdKonta(Long idKonta) { this.idKonta = idKonta; }

    public Long getIdFilii() { return idFilii; }
    public void setIdFilii(Long idFilii) { this.idFilii = idFilii; }

    public String getTerminZwrotu() { return terminZwrotu; }
    public void setTerminZwrotu(String terminZwrotu) { this.terminZwrotu = terminZwrotu; }

    public List<Long> getEgzemplarzeId() { return egzemplarzeId; }
    public void setEgzemplarzeId(List<Long> egzemplarzeId) { this.egzemplarzeId = egzemplarzeId; }

    public String getDostawa() { return dostawa; }
    public void setDostawa(String dostawa) { this.dostawa = dostawa; }

    public String getAdresDostawy() { return adresDostawy; }
    public void setAdresDostawy(String adresDostawy) { this.adresDostawy = adresDostawy; }

    public LocalDate getDataWypozyczenia() { return dataWypozyczenia; }
    public void setDataWypozyczenia(LocalDate dataWypozyczenia) { this.dataWypozyczenia = dataWypozyczenia; }

    public LocalDate getDataZwrotu() { return dataZwrotu; }
    public void setDataZwrotu(LocalDate dataZwrotu) { this.dataZwrotu = dataZwrotu; }

    public List<String> getFilmy() { return filmy; }
    public void setFilmy(List<String> filmy) { this.filmy = filmy; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
