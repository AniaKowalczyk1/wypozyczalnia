package com.example.film.controller;

import com.example.film.dto.FilmAvailabilityDto;
import com.example.film.service.FilmService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/films")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FilmController {

    private final FilmService filmService;

    public FilmController(FilmService filmService) {
        this.filmService = filmService;
    }

    @GetMapping
    public List<FilmAvailabilityDto> getAllFilms() {
        return filmService.getAllFilmsWithStatus();
    }

    @GetMapping("/popular")
    public List<FilmAvailabilityDto> getTopPopularFilms() {
        return filmService.getTop3PopularFilms();
    }

}
