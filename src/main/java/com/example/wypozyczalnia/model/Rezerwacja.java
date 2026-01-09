package com.example.wypozyczalnia.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Rezerwacja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRezerwacji;

    private LocalDate dataRezerwacji;
    private LocalDate terminOdbioru;

    @Enumerated(EnumType.STRING)
    private StatusRezerwacji status;   // AKTYWNA, ZREALIZOWANA, ODWOLANA, PRZETERMINOWANA

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_klienta", nullable = false)
    private Klient klient;

    @ManyToMany
    @JoinTable(
            name = "Rezerwacja_Egzemplarz",
            joinColumns = @JoinColumn(name = "id_rezerwacji"),
            inverseJoinColumns = @JoinColumn(name = "id_egzemplarza")
    )
    private List<Egzemplarz> egzemplarze = new ArrayList<>();

    // ===== Gettery i Settery =====
    public Long getIdRezerwacji() { return idRezerwacji; }
    public void setIdRezerwacji(Long idRezerwacji) { this.idRezerwacji = idRezerwacji; }

    public LocalDate getDataRezerwacji() { return dataRezerwacji; }
    public void setDataRezerwacji(LocalDate dataRezerwacji) { this.dataRezerwacji = dataRezerwacji; }

    public LocalDate getTerminOdbioru() { return terminOdbioru; }
    public void setTerminOdbioru(LocalDate terminOdbioru) { this.terminOdbioru = terminOdbioru; }

    public StatusRezerwacji getStatus() { return status; }
    public void setStatus(StatusRezerwacji status) { this.status = status; }

    public Klient getKlient() { return klient; }
    public void setKlient(Klient klient) { this.klient = klient; }

    public List<Egzemplarz> getEgzemplarze() { return egzemplarze; }
    public void setEgzemplarze(List<Egzemplarz> egzemplarze) { this.egzemplarze = egzemplarze; }

    public void addEgzemplarz(Egzemplarz egzemplarz) {
        if (!egzemplarze.contains(egzemplarz)) {
            egzemplarze.add(egzemplarz);
        }
    }
}
