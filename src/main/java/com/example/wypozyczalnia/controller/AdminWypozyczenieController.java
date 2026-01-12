package com.example.wypozyczalnia.controller;

import com.example.wypozyczalnia.model.Kara;
import com.example.wypozyczalnia.model.Wypozyczenie;
import com.example.wypozyczalnia.repository.WypozyczenieRepository;
import com.example.wypozyczalnia.repository.KaraRepository;
import com.example.wypozyczalnia.service.WypozyczenieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/wypozyczenia")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminWypozyczenieController {

    private final WypozyczenieService wypozyczenieService;
    private final WypozyczenieRepository wypozyczenieRepo;
    private final KaraRepository karaRepo;

    public AdminWypozyczenieController(WypozyczenieService wypozyczenieService, WypozyczenieRepository wypozyczenieRepo, KaraRepository karaRepo) {
        this.wypozyczenieService = wypozyczenieService;
        this.wypozyczenieRepo = wypozyczenieRepo;
        this.karaRepo = karaRepo;
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
    @GetMapping("/{idWypozyczenia}/kara")
    public ResponseEntity<?> checkFine(@PathVariable Long idWypozyczenia) {
        Wypozyczenie w = wypozyczenieRepo.findById(idWypozyczenia)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono wypożyczenia"));

        // Sprawdź czy kara już istnieje w bazie
        Optional<Kara> karaDb = karaRepo.findByWypozyczenieIdWypozyczenia(idWypozyczenia);

        if (karaDb.isPresent() && !karaDb.get().getOplacone()) {
            return ResponseEntity.ok(Map.of("kwota", karaDb.get().getKwotaCalkowita()));
        }

        // Jeśli nie ma w bazie, oblicz ją
        double wyliczonaKwota = wypozyczenieService.obliczAktualnaKare(w);

        if (wyliczonaKwota > 0) {
            return ResponseEntity.ok(Map.of("kwota", wyliczonaKwota));
        }

        return ResponseEntity.ok(Map.of("brakKary", true));
    }
}