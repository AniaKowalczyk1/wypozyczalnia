package com.example.wypozyczalnia.service;

import com.example.wypozyczalnia.dto.RezerwacjaViewDTO;
import com.example.wypozyczalnia.model.Rezerwacja;
import com.example.wypozyczalnia.model.StatusRezerwacji;
import com.example.wypozyczalnia.repository.RezerwacjaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RezerwacjaViewService {

    private final RezerwacjaRepository rezerwacjaRepository;

    public RezerwacjaViewService(RezerwacjaRepository rezerwacjaRepository) {
        this.rezerwacjaRepository = rezerwacjaRepository;
    }

    // ===== Pobranie wszystkich rezerwacji klienta =====
    @Transactional(readOnly = true)
    public List<RezerwacjaViewDTO> getAllReservations(Long idKlienta) {
        List<Rezerwacja> rezerwacje = rezerwacjaRepository.findByKlientIdKlienta(idKlienta);
        return rezerwacje.stream()
                .map(RezerwacjaViewDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // ===== Pobranie aktywnych rezerwacji =====
    @Transactional(readOnly = true)
    public List<RezerwacjaViewDTO> getActiveReservations(Long idKlienta) {
        List<Rezerwacja> rezerwacje = rezerwacjaRepository.findByKlientIdKlientaAndStatus(idKlienta,
                StatusRezerwacji.AKTYWNA);
        return rezerwacje.stream()
                .map(RezerwacjaViewDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // ===== Pobranie przeszłych rezerwacji =====
    @Transactional(readOnly = true)
    public List<RezerwacjaViewDTO> getPastReservations(Long idKlienta) {
        List<Rezerwacja> rezerwacje = rezerwacjaRepository.findByKlientIdKlientaAndStatusNot(idKlienta,
                StatusRezerwacji.AKTYWNA);
        return rezerwacje.stream()
                .map(RezerwacjaViewDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // ===== Odwołanie rezerwacji przez klienta =====
    @Transactional
    public boolean odwolajRezerwacje(Long idRezerwacji) {
        return rezerwacjaRepository.findById(idRezerwacji).map(rezerwacja -> {

            // Tylko aktywne rezerwacje można odwołać
            if (rezerwacja.getStatus() != StatusRezerwacji.AKTYWNA) {
                return false;
            }

            LocalDate dzisiaj = LocalDate.now();
            LocalDate dataRezerwacji = rezerwacja.getDataRezerwacji();

            // Odwołanie tylko w ciągu 1 dnia od daty rezerwacji
            if (dzisiaj.isAfter(dataRezerwacji.plusDays(1))) {
                return false;
            }

            rezerwacja.setStatus(StatusRezerwacji.ODWOLANA);
            rezerwacjaRepository.save(rezerwacja);
            return true;
        }).orElse(false);
    }

    // ===== Automatyczne anulowanie przeterminowanych rezerwacji =====
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void checkAndMarkExpired() {
        LocalDate dzisiaj = LocalDate.now();

        List<Rezerwacja> aktywneRezerwacje = rezerwacjaRepository.findByStatus(StatusRezerwacji.AKTYWNA);

        aktywneRezerwacje.stream()
                .filter(r -> r.getTerminOdbioru().isBefore(dzisiaj))
                .forEach(r -> r.setStatus(StatusRezerwacji.PRZETERMINOWANA));

        if (!aktywneRezerwacje.isEmpty()) {
            rezerwacjaRepository.saveAll(aktywneRezerwacje);
        }
    }
}
