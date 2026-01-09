package com.example.wypozyczalnia.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Egzemplarz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEgzemplarza;

    @Convert(converter = StatusConverter.class)
    private StatusEgzemplarza status = StatusEgzemplarza.DOSTEPNY;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_filmu", nullable = false)
    private Film film;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_filii", nullable = false)
    private Filia filia;

    @ManyToMany(mappedBy = "egzemplarze")
    private List<Wypozyczenie> wypozyczenia = new ArrayList<>();

    @ManyToMany(mappedBy = "egzemplarze")
    private List<Rezerwacja> rezerwacje = new ArrayList<>();


    // ===== Gettery i Settery =====
    public Long getIdEgzemplarza() { return idEgzemplarza; }
    public void setIdEgzemplarza(Long idEgzemplarza) { this.idEgzemplarza = idEgzemplarza; }

    public StatusEgzemplarza getStatus() { return status; }
    public void setStatus(StatusEgzemplarza status) { this.status = status; }

    public Film getFilm() { return film; }
    public void setFilm(Film film) { this.film = film; }

    public Filia getFilia() { return filia; }
    public void setFilia(Filia filia) { this.filia = filia; }

    public List<Wypozyczenie> getWypozyczenia() { return wypozyczenia; }
    public void setWypozyczenia(List<Wypozyczenie> wypozyczenia) { this.wypozyczenia = wypozyczenia; }

    // ===== Metoda pomocnicza do dodawania wypożyczenia =====
    public void addWypozyczenie(Wypozyczenie wypozyczenie) {
        if (!wypozyczenia.contains(wypozyczenie)) {
            wypozyczenia.add(wypozyczenie);
        }
    }

    // ===== Metoda pomocnicza do dodawania rezerwacji =====
    public void addRezerwacja(Rezerwacja rezerwacja) {
        if (!rezerwacje.contains(rezerwacja)) {
            rezerwacje.add(rezerwacja);
            rezerwacja.addEgzemplarz(this); // synchronizacja obustronna
        }
    }

}
