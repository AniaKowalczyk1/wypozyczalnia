package com.example.film.model;

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




    // ===== Gettery i Settery =====
    public Long getIdEgzemplarza() { return idEgzemplarza; }
    public void setIdEgzemplarza(Long idEgzemplarza) { this.idEgzemplarza = idEgzemplarza; }

    public StatusEgzemplarza getStatus() { return status; }
    public void setStatus(StatusEgzemplarza status) { this.status = status; }

    public Film getFilm() { return film; }
    public void setFilm(Film film) { this.film = film; }

    public Filia getFilia() { return filia; }
    public void setFilia(Filia filia) { this.filia = filia; }



}
