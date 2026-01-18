package com.example.wypozyczalnia.controller;

import com.example.wypozyczalnia.dto.ReserveRequest;
import com.example.wypozyczalnia.model.Rezerwacja;
import com.example.wypozyczalnia.service.RezerwacjaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rezerwacje")
public class RezerwacjaController {

    private final RezerwacjaService rezerwacjaService;

    public RezerwacjaController(RezerwacjaService rezerwacjaService) {
        this.rezerwacjaService = rezerwacjaService;
    }

    @PostMapping
    public ResponseEntity<?> createRezerwacja(@RequestBody ReserveRequest request) {
        try {
            Rezerwacja rezerwacja =
                    rezerwacjaService.createRezerwacja(request);
            return ResponseEntity.ok(rezerwacja);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
