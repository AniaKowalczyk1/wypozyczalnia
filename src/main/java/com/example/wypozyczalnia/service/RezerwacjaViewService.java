package com.example.wypozyczalnia.service;

import com.example.wypozyczalnia.dto.RezerwacjaViewDTO;
import com.example.wypozyczalnia.model.Rezerwacja;
import com.example.wypozyczalnia.repository.RezerwacjaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RezerwacjaViewService {

    private final RezerwacjaRepository rezerwacjaRepository;

    public RezerwacjaViewService(RezerwacjaRepository rezerwacjaRepository) {
        this.rezerwacjaRepository = rezerwacjaRepository;
    }

    @Transactional(readOnly = true)
    public List<RezerwacjaViewDTO> getAllReservations(Long idKlienta) {
        List<Rezerwacja> rezerwacje = rezerwacjaRepository.findByKlientIdKlienta(idKlienta);
        return rezerwacje.stream()
                .map(RezerwacjaViewDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RezerwacjaViewDTO> getActiveReservations(Long idKlienta) {
        List<Rezerwacja> rezerwacje = rezerwacjaRepository.findByKlientIdKlientaAndStatus(idKlienta,
                com.example.wypozyczalnia.model.StatusRezerwacji.AKTYWNA);
        return rezerwacje.stream()
                .map(RezerwacjaViewDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RezerwacjaViewDTO> getPastReservations(Long idKlienta) {
        List<Rezerwacja> rezerwacje = rezerwacjaRepository.findByKlientIdKlientaAndStatusNot(idKlienta,
                com.example.wypozyczalnia.model.StatusRezerwacji.AKTYWNA);
        return rezerwacje.stream()
                .map(RezerwacjaViewDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
