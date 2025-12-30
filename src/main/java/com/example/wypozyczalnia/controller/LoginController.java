package com.example.wypozyczalnia.controller;

import com.example.wypozyczalnia.dto.LoginRequest;
import com.example.wypozyczalnia.model.Konto;
import com.example.wypozyczalnia.service.KontoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/login")
public class LoginController {

    private final KontoService kontoService;

    @Autowired
    public LoginController(KontoService kontoService) {
        this.kontoService = kontoService;
    }

    // ===== LOGOWANIE =====
    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        boolean authenticated = kontoService.authenticate(
                request.getLogin(),
                request.getHaslo()
        );

        if (!authenticated) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Nieprawidłowy login lub hasło");
        }

        Konto konto = kontoService.getKontoByLogin(request.getLogin());

        return ResponseEntity.ok(konto.getRola());
    }
}
