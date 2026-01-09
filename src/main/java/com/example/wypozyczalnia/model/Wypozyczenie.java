package com.example.wypozyczalnia.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Wypozyczenie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idWypozyczenia;

    private LocalDate dataWypozyczenia;
    private LocalDate terminZwrotu;
    private LocalDate dataZwrotu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pracownika")
    private Pracownik pracownik;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_klienta", nullable = false)
    private Klient klient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_filii", nullable = false)
    private Filia filia;

    @ManyToMany
    @JoinTable(
            name = "Wypozyczenie_Egzemplarz",
            joinColumns = @JoinColumn(name = "id_wypozyczenia"),
            inverseJoinColumns = @JoinColumn(name = "id_egzemplarza")
    )
    private List<Egzemplarz> egzemplarze = new ArrayList<>();

    @OneToOne(mappedBy = "wypozyczenie", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Kara kara;

    // ===== Gettery i Settery =====
    public Kara getKara() {return kara;}
    public void setKara(Kara kara) { this.kara = kara; }

    public Long getIdWypozyczenia() { return idWypozyczenia; }
    public void setIdWypozyczenia(Long idWypozyczenia) { this.idWypozyczenia = idWypozyczenia; }

    public LocalDate getDataWypozyczenia() { return dataWypozyczenia; }
    public void setDataWypozyczenia(LocalDate dataWypozyczenia) { this.dataWypozyczenia = dataWypozyczenia; }

    public LocalDate getTerminZwrotu() { return terminZwrotu; }
    public void setTerminZwrotu(LocalDate terminZwrotu) { this.terminZwrotu = terminZwrotu; }

    public LocalDate getDataZwrotu() { return dataZwrotu; }
    public void setDataZwrotu(LocalDate dataZwrotu) { this.dataZwrotu = dataZwrotu; }

    public Pracownik getPracownik() { return pracownik; }
    public void setPracownik(Pracownik pracownik) { this.pracownik = pracownik; }

    public Klient getKlient() { return klient; }
    public void setKlient(Klient klient) { this.klient = klient; }

    public Filia getFilia() { return filia; }
    public void setFilia(Filia filia) { this.filia = filia; }

    public List<Egzemplarz> getEgzemplarze() { return egzemplarze; }
    public void setEgzemplarze(List<Egzemplarz> egzemplarze) { this.egzemplarze = egzemplarze; }

    // ===== Metoda pomocnicza do dodawania egzemplarza =====
    public void addEgzemplarz(Egzemplarz egzemplarz) {
        if (!egzemplarze.contains(egzemplarz)) {
            egzemplarze.add(egzemplarz);
            egzemplarz.addWypozyczenie(this); // synchronizacja obustronna
        }
    }
}
