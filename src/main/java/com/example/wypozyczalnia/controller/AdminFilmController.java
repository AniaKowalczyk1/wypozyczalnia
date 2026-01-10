package com.example.wypozyczalnia.controller;

import com.example.wypozyczalnia.model.Film;
import com.example.wypozyczalnia.repository.FilmRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/films")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminFilmController {

    private final FilmRepository filmRepository;

    public AdminFilmController(FilmRepository filmRepository) {
        this.filmRepository = filmRepository;
    }

    @PostMapping
    public ResponseEntity<?> addFilm(@RequestBody Film film) {
        try {
            Film savedFilm = filmRepository.save(film);
            return ResponseEntity.ok(savedFilm);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Błąd podczas dodawania filmu.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFilm(@PathVariable Long id) {
        try {
            Film film = filmRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono filmu"));

            // KLUCZOWY WARUNEK: Sprawdzamy czy lista egzemplarzy jest pusta
            if (film.getEgzemplarze() != null && !film.getEgzemplarze().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Nie można usunąć filmu, który posiada przypisane egzemplarze!"));
            }

            filmRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Film został usunięty."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Błąd: " + e.getMessage());
        }
    }
}