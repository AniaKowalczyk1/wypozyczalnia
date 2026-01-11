package com.example.wypozyczalnia.controller;

import com.example.wypozyczalnia.repository.WypozyczenieRepository;
import com.example.wypozyczalnia.service.WypozyczenieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/wypozyczenia")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminWypozyczenieController {

    private final WypozyczenieService wypozyczenieService;
    private final WypozyczenieRepository wypozyczenieRepo;

    public AdminWypozyczenieController(WypozyczenieService wypozyczenieService, WypozyczenieRepository wypozyczenieRepo) {
        this.wypozyczenieService = wypozyczenieService;
        this.wypozyczenieRepo = wypozyczenieRepo;
    }

    // Pobierz wszystkie AKTYWNE wypożyczenia konkretnego klienta
    @GetMapping("/active-by-client/{idKlienta}")
    public ResponseEntity<?> getActiveByClient(@PathVariable Long idKlienta) {
        return ResponseEntity.ok(wypozyczenieRepo.findByKlientIdKlientaAndDataZwrotuIsNull(idKlienta));
    }

    // Endpoint do procesowania zwrotu
    @PostMapping("/return/{id}")
    public ResponseEntity<?> returnFilms(@PathVariable Long id) {
        try {
            wypozyczenieService.returnWypozyczenie(id);
            return ResponseEntity.ok(Map.of("message", "Zwrot przyjęty pomyślnie"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/return-item")
    public ResponseEntity<?> returnSingleItem(
            @RequestParam Long idWypozyczenia,
            @RequestParam Long idEgzemplarza,
            @RequestParam Long idFiliiPracownika) { // DODAJEMY TEN PARAMETR
        try {
            wypozyczenieService.returnSingleEgzemplarz(idWypozyczenia, idEgzemplarza, idFiliiPracownika);
            return ResponseEntity.ok(Map.of("message", "Egzemplarz zwrócony"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}