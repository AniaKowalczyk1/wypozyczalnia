package com.example.wypozyczalnia.controller;

import com.example.wypozyczalnia.dto.WypozyczenieViewDTO;
import com.example.wypozyczalnia.service.WypozyczenieViewService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/wypozyczenia")
public class WypozyczenieViewController {

    private final WypozyczenieViewService wypozyczenieViewService;

    public WypozyczenieViewController(WypozyczenieViewService wypozyczenieViewService) {
        this.wypozyczenieViewService = wypozyczenieViewService;
    }

    @GetMapping("/all/{idKlienta}")
    public List<WypozyczenieViewDTO> getAllRentals(@PathVariable Long idKlienta) {
        return wypozyczenieViewService.getAllRentals(idKlienta);
    }

    @GetMapping("/active/{idKlienta}")
    public List<WypozyczenieViewDTO> getActiveRentals(@PathVariable Long idKlienta) {
        return wypozyczenieViewService.getActiveRentals(idKlienta);
    }

    @GetMapping("/past/{idKlienta}")
    public List<WypozyczenieViewDTO> getPastRentals(@PathVariable Long idKlienta) {
        return wypozyczenieViewService.getPastRentals(idKlienta);
    }
}
