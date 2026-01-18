package com.example.wypozyczalnia.controller;

import com.example.wypozyczalnia.dto.RezerwacjaViewDTO;
import com.example.wypozyczalnia.service.RezerwacjaViewService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rezerwacje")
public class RezerwacjaViewController {

    private final RezerwacjaViewService rezerwacjaViewService;

    public RezerwacjaViewController(RezerwacjaViewService rezerwacjaViewService) {
        this.rezerwacjaViewService = rezerwacjaViewService;
    }

    @GetMapping("/all/{idKlienta}")
    public List<RezerwacjaViewDTO> getAllReservations(@PathVariable Long idKlienta) {
        // najpierw aktualizacja statusu przeterminowanych
        rezerwacjaViewService.checkAndMarkExpired();

        return rezerwacjaViewService.getAllReservations(idKlienta);
    }

    @GetMapping("/active/{idKlienta}")
    public List<RezerwacjaViewDTO> getActiveReservations(@PathVariable Long idKlienta) {
        rezerwacjaViewService.checkAndMarkExpired();
        return rezerwacjaViewService.getActiveReservations(idKlienta);
    }

    @GetMapping("/past/{idKlienta}")
    public List<RezerwacjaViewDTO> getPastReservations(@PathVariable Long idKlienta) {
        rezerwacjaViewService.checkAndMarkExpired();
        return rezerwacjaViewService.getPastReservations(idKlienta);
    }


    @PostMapping("/odwolaj/{idRezerwacji}")
    public boolean odwolajRezerwacje(@PathVariable Long idRezerwacji) {
        return rezerwacjaViewService.odwolajRezerwacje(idRezerwacji);
    }
}
