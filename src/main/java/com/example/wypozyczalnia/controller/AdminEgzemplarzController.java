package com.example.wypozyczalnia.controller;

import com.example.wypozyczalnia.model.*;
import com.example.wypozyczalnia.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/egzemplarze")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminEgzemplarzController {

    private final EgzemplarzRepository egzemplarzRepo;
    private final FilmRepository filmRepo;
    private final FiliaRepository filiaRepo;

    // KONSTRUKTOR - musi mieć tę samą nazwę co klasa wyżej!
    public AdminEgzemplarzController(EgzemplarzRepository egzemplarzRepo,
                                     FilmRepository filmRepo,
                                     FiliaRepository filiaRepo) {
        this.egzemplarzRepo = egzemplarzRepo;
        this.filmRepo = filmRepo;
        this.filiaRepo = filiaRepo;
    }

    @PostMapping
    public ResponseEntity<?> addEgzemplarz(@RequestBody Map<String, Long> payload) {
        try {
            Long idFilmu = payload.get("idFilmu");
            Long idFilii = payload.get("idFilii");

            Film film = filmRepo.findById(idFilmu)
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono filmu"));
            Filia filia = filiaRepo.findById(idFilii)
                    .orElseThrow(() -> new RuntimeException("Nie znaleziono filii"));

            Egzemplarz nowy = new Egzemplarz();
            nowy.setFilm(film);
            nowy.setFilia(filia);
            nowy.setStatus(StatusEgzemplarza.DOSTEPNY);

            egzemplarzRepo.save(nowy);
            return ResponseEntity.ok(Map.of("message", "Dodano egzemplarz"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEgzemplarz(@PathVariable Long id) {
        try {
            egzemplarzRepo.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Usunięto egzemplarz"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Błąd podczas usuwania: " + e.getMessage());
        }
    }
}