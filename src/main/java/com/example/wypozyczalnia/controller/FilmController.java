package com.example.wypozyczalnia.controller;

import com.example.wypozyczalnia.model.Film;
import com.example.wypozyczalnia.repository.FilmRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/filmy")
@CrossOrigin(origins = "http://localhost:3000") // umożliwia dostęp z Reacta
public class FilmController {

    private final FilmRepository filmRepository;

    public FilmController(FilmRepository filmRepository) {
        this.filmRepository = filmRepository;
    }

    // Pobierz wszystkie filmy
    @GetMapping
    public List<Film> getFilmy() {
        return filmRepository.findAll();
    }

    // Dodaj nowy film
    @PostMapping
    public Film addFilm(@RequestBody Film film) {
        return filmRepository.save(film);
    }


}
