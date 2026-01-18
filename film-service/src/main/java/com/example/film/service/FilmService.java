package com.example.film.service;

import com.example.film.dto.EgzemplarzDto;
import com.example.film.dto.FilmAvailabilityDto;
import com.example.film.model.Film; // Import z nowej paczki
import com.example.film.repository.FilmRepository;
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

    public List<FilmAvailabilityDto> getAllFilmsWithStatus() {
        return filmRepository.findAll().stream()
                .map(this::mapToFilmAvailabilityDto)
                .collect(Collectors.toList());
    }

    public List<FilmAvailabilityDto> getTop3PopularFilms() {
        Pageable pageable = PageRequest.of(0, 3);
        // Repository nadal wykona SQL liczący wypożyczenia w bazie danych
        return filmRepository.findTop3MostPopular(pageable)
                .stream()
                .map(this::mapToFilmAvailabilityDto)
                .toList();
    }

    // Wyciągnięte mapowanie do osobnej metody, by uniknąć powtórzeń kodu
    private FilmAvailabilityDto mapToFilmAvailabilityDto(Film film) {
        List<EgzemplarzDto> egzemplarzeDto = film.getEgzemplarze().stream()
                .map(e -> new EgzemplarzDto(
                        e.getIdEgzemplarza(),
                        e.getStatus().name(),
                        e.getFilia() != null ? e.getFilia().getIdFilii() : null,
                        e.getFilia() != null ? e.getFilia().getNazwa() : "—",
                        film.getTytul()
                ))
                .collect(Collectors.toList());

        return new FilmAvailabilityDto(
                film.getIdFilmu(),
                film.getTytul(),
                film.getGatunek(),
                film.getRokWydania(),
                film.getRezyser(),
                film.getOpis(),
                egzemplarzeDto,
                film.getPlakat()
        );
    }
}