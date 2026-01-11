package com.example.wypozyczalnia.service;

import com.example.wypozyczalnia.dto.EgzemplarzDto;
import com.example.wypozyczalnia.dto.FilmAvailabilityDto;
import com.example.wypozyczalnia.model.Egzemplarz;
import com.example.wypozyczalnia.model.Film;
import com.example.wypozyczalnia.model.StatusEgzemplarza;
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

    public List<FilmAvailabilityDto> getAllFilmsWithStatus() {
        return filmRepository.findAll().stream()
                .map(film -> {
                    // Mapujemy egzemplarze do DTO
                    List<EgzemplarzDto> egzemplarzeDto = film.getEgzemplarze().stream()
                            .map(e -> new EgzemplarzDto(
                                    e.getIdEgzemplarza(),
                                    e.getStatus().name(),
                                    e.getFilia() != null ? e.getFilia().getIdFilii() : null,
                                    e.getFilia() != null ? e.getFilia().getNazwa() : "—",
                                    film.getTytul() // <-- teraz OK, bo konstruktor ma 5 parametrów
                            ))

                            .collect(Collectors.toList());

                    return new FilmAvailabilityDto(
                            film.getIdFilmu(),
                            film.getTytul(),
                            film.getGatunek(),
                            film.getRokWydania(),
                            film.getRezyser(),
                            film.getOpis(),
                            egzemplarzeDto
                    );
                })
                .collect(Collectors.toList());
    }

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

                    return new FilmAvailabilityDto(
                            film.getIdFilmu(),
                            film.getTytul(),
                            film.getGatunek(),
                            film.getRokWydania(),
                            film.getRezyser(),
                            film.getOpis(),
                            egzemplarzeDto
                    );
                })
                .toList();
    }


}
