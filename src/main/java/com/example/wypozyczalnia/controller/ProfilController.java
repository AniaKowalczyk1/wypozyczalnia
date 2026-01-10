package com.example.wypozyczalnia.controller;

import com.example.wypozyczalnia.dto.ProfilDto;
import com.example.wypozyczalnia.service.ProfilService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profil")
public class ProfilController {

    @Autowired
    private ProfilService profilService;

    // Pobranie danych profilu
    @GetMapping("/{idKlienta}")
    public ResponseEntity<ProfilDto> getProfil(@PathVariable Long idKlienta) {
        ProfilDto profil = profilService.getProfil(idKlienta);
        return ResponseEntity.ok(profil);
    }

    // Aktualizacja danych profilu
    @PutMapping("/{idKlienta}")
    public ResponseEntity<ProfilDto> updateProfil(@PathVariable Long idKlienta,
                                                  @RequestBody ProfilDto profilDto) {
        ProfilDto updated = profilService.updateProfil(idKlienta, profilDto);
        return ResponseEntity.ok(updated);
    }
}
