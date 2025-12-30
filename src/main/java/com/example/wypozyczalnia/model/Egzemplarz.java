package com.example.wypozyczalnia.model;

import jakarta.persistence.*;

@Entity
@Table(name = "egzemplarz")
public class Egzemplarz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusEgzemplarza status = StatusEgzemplarza.DOSTEPNY;

    @ManyToOne
    @JoinColumn(name = "id_filmu", nullable = false)
    private Film film;

    @ManyToOne
    @JoinColumn(name = "id_filii", nullable = false)
    private Filia filia;

    public Egzemplarz() {}

    public Egzemplarz(StatusEgzemplarza status, Film film, Filia filia) {
        this.status = status;
        this.film = film;
        this.filia = filia;
    }

    // Gettery i Settery
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public StatusEgzemplarza getStatus() { return status; }
    public void setStatus(StatusEgzemplarza status) { this.status = status; }

    public Film getFilm() { return film; }
    public void setFilm(Film film) { this.film = film; }

    public Filia getFilia() { return filia; }
    public void setFilia(Filia filia) { this.filia = filia; }
}
