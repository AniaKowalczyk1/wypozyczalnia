package com.example.wypozyczalnia.controller;

import com.example.wypozyczalnia.dto.LoginRequest;
import com.example.wypozyczalnia.model.Konto;
import com.example.wypozyczalnia.service.KontoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/login")
public class LoginController {

    private final KontoService kontoService;

    @Autowired
    public LoginController(KontoService kontoService) {
        this.kontoService = kontoService;
    }

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Konto konto = kontoService.getKontoByLogin(request.getLogin());

        if (konto == null || !kontoService.authenticate(request.getLogin(), request.getHaslo())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Nieprawidłowy login lub hasło");
        }

        // Ustawienie uwierzytelnienia w SecurityContext
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                konto.getLogin(),
                null,
                List.of(new SimpleGrantedAuthority(konto.getRola()))
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        // Przygotowanie pełnych danych klienta
        Map<String, Object> response;
        if (konto.getKlient() != null) {
            response = Map.of(
                    "idKonta", konto.getId(),
                    "rola", konto.getRola(),
                    "idKlienta", konto.getKlient().getIdKlienta(),
                    "imie", konto.getKlient().getImie(),
                    "nazwisko", konto.getKlient().getNazwisko(),
                    "adres", konto.getKlient().getAdres(),
                    "login", konto.getLogin(),
                    "email", konto.getEmail()
            );
        } else {
            response = Map.of(
                    "idKonta", konto.getId(),
                    "rola", konto.getRola(),
                    "login", konto.getLogin(),
                    "email", konto.getEmail()
            );
        }

        return ResponseEntity.ok(response);
    }
}
