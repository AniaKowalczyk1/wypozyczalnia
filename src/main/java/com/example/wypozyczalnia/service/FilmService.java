package com.example.wypozyczalnia.service;

import com.example.wypozyczalnia.dto.EgzemplarzDto;
import com.example.wypozyczalnia.dto.FilmAvailabilityDto;
import com.example.wypozyczalnia.model.Film;
import com.example.wypozyczalnia.repository.FilmRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FilmService {

    private final FilmRepository filmRepository;

    public FilmService(FilmRepository filmRepository) {
        this.filmRepository = filmRepository;
    }

    // ===== Wszystkie filmy =====
    public List<FilmAvailabilityDto> getAllFilmsWithStatus() {
        return filmRepository.findAll().stream()
                .map(film -> {
                    List<EgzemplarzDto> egzemplarzeDto = film.getEgzemplarze().stream()
                            .map(e -> new EgzemplarzDto(
                                    e.getIdEgzemplarza(),
                                    e.getStatus().name(),
                                    e.getFilia() != null ? e.getFilia().getIdFilii() : null,
                                    e.getFilia() != null ? e.getFilia().getNazwa() : "—",
                                    film.getTytul()
                            ))
                            .collect(Collectors.toList());

                    // Konstruktor z plakatem
                    return new FilmAvailabilityDto(
                            film.getIdFilmu(),
                            film.getTytul(),
                            film.getGatunek(),
                            film.getRokWydania(),
                            film.getRezyser(),
                            film.getOpis(),
                            egzemplarzeDto,
                            film.getPlakat() // plakat
                    );
                })
                .collect(Collectors.toList());
    }

    // ===== Top 3 popularne filmy =====
    public List<FilmAvailabilityDto> getTop3PopularFilms() {

        Pageable pageable = PageRequest.of(0, 3);

        return filmRepository.findTop3MostPopular(pageable)
                .stream()
                .map(film -> {
                    List<EgzemplarzDto> egzemplarzeDto = film.getEgzemplarze().stream()
                            .map(e -> new EgzemplarzDto(
                                    e.getIdEgzemplarza(),
                                    e.getStatus().name(),
                                    e.getFilia() != null ? e.getFilia().getIdFilii() : null,
                                    e.getFilia() != null ? e.getFilia().getNazwa() : "—",
                                    film.getTytul()
                            ))
                            .toList();

                    // Konstruktor z plakatem
                    return new FilmAvailabilityDto(
                            film.getIdFilmu(),
                            film.getTytul(),
                            film.getGatunek(),
                            film.getRokWydania(),
                            film.getRezyser(),
                            film.getOpis(),
                            egzemplarzeDto,
                            film.getPlakat() // dodanie plakatu
                    );
                })
                .toList();
    }
}
