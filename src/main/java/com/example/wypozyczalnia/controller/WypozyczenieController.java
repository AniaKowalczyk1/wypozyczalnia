package com.example.wypozyczalnia.controller;

import com.example.wypozyczalnia.dto.WypozyczenieRequest;
import com.example.wypozyczalnia.model.Wypozyczenie;
import com.example.wypozyczalnia.service.WypozyczenieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.wypozyczalnia.dto.ReserveRequest;

import java.util.List;

@RestController
@RequestMapping("/api/wypozyczenia")
public class WypozyczenieController {

    private final WypozyczenieService wypozyczenieService;

    public WypozyczenieController(WypozyczenieService wypozyczenieService) {
        this.wypozyczenieService = wypozyczenieService;
    }

    @PostMapping
    public ResponseEntity<?> createWypozyczenie(@RequestBody WypozyczenieRequest request) {
        try {
            Wypozyczenie wypozyczenie = wypozyczenieService.createWypozyczenie(request);
            return ResponseEntity.ok(wypozyczenie);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reserve")
    public ResponseEntity<?> reserveEgzemplarze(@RequestBody ReserveRequest request) {
        try {
            Wypozyczenie wypozyczenie = wypozyczenieService.reserveEgzemplarze(request);
            return ResponseEntity.ok(wypozyczenie);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
