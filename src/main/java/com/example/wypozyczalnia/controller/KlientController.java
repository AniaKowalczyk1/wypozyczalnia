package com.example.wypozyczalnia.controller;

import com.example.wypozyczalnia.model.Klient;
import com.example.wypozyczalnia.model.Konto;
import com.example.wypozyczalnia.repository.KontoRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/klient")
public class KlientController {

    private final KontoRepository kontoRepo;
    private static final Logger logger = LoggerFactory.getLogger(KlientController.class);

    public KlientController(KontoRepository kontoRepo) {
        this.kontoRepo = kontoRepo;
    }

    @GetMapping("/me")
    public Map<String, Object> getLoggedClient(Authentication authentication) {
        String login = authentication.getName();
        Konto konto = kontoRepo.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono konta dla loginu: " + login));

        Klient klient = konto.getKlient();
        if (klient == null) {
            throw new RuntimeException("Konto nie jest powiązane z klientem: " + login);
        }

        // Wypisz w konsoli dla debugu
        System.out.println("Zalogowany klient: " + klient.getImie() + " " + klient.getNazwisko() + ", adres: " + klient.getAdres());

        Map<String, Object> response = new HashMap<>();
        response.put("idKlienta", klient.getIdKlienta());
        response.put("kontoId", konto.getId());
        response.put("login", konto.getLogin());
        response.put("email", konto.getEmail());
        response.put("imie", klient.getImie());
        response.put("nazwisko", klient.getNazwisko());
        response.put("adres", klient.getAdres());

        return response;
    }

}
