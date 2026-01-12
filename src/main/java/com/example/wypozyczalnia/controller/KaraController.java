package com.example.wypozyczalnia.controller;

import com.example.wypozyczalnia.dto.KaraDto;
import com.example.wypozyczalnia.service.KaraServiceView;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/kary")
public class KaraController {

    private final KaraServiceView karaServiceView;

    public KaraController(KaraServiceView karaServiceView) {
        this.karaServiceView = karaServiceView;
    }

    @GetMapping("/klient/{id}")
    public List<KaraDto> getKaryDlaKlienta(@PathVariable Long id) {
        // Tutaj metoda aktualizuje i zwraca listę kar
        return karaServiceView.aktualizujKaryDlaKlienta(id);
    }
}
