package com.example.wypozyczalnia.service;

import com.example.wypozyczalnia.dto.ReserveRequest;
import com.example.wypozyczalnia.model.*;
import com.example.wypozyczalnia.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class RezerwacjaService {

    private final RezerwacjaRepository rezerwacjaRepo;
    private final EgzemplarzRepository egzemplarzRepo;
    private final KontoRepository kontoRepo;
    private final FiliaRepository filiaRepo;

    public RezerwacjaService(
            RezerwacjaRepository rezerwacjaRepo,
            EgzemplarzRepository egzemplarzRepo,
            KontoRepository kontoRepo,
            FiliaRepository filiaRepo
    ) {
        this.rezerwacjaRepo = rezerwacjaRepo;
        this.egzemplarzRepo = egzemplarzRepo;
        this.kontoRepo = kontoRepo;
        this.filiaRepo = filiaRepo;
    }

    @Transactional
    public Rezerwacja createRezerwacja(ReserveRequest request) {

        System.out.println("===== Nowa rezerwacja =====");
        System.out.println("Request: " + request);

        // ===== Pobierz konto =====
        Konto konto = kontoRepo.findById(request.getIdKonta())
                .orElseThrow(() ->
                        new RuntimeException("Nie znaleziono konta: " + request.getIdKonta()));

        // ===== Pobierz klienta =====
        Klient klient = konto.getKlient();
        if (klient == null) {
            throw new RuntimeException("Konto nie jest powiązane z klientem");
        }

        // ===== Pobierz filię =====
        Filia filia = filiaRepo.findById(request.getIdFilii())
                .orElseThrow(() ->
                        new RuntimeException("Nie znaleziono filii: " + request.getIdFilii()));

        // ===== Pobierz egzemplarze =====
        List<Egzemplarz> egzemplarze =
                egzemplarzRepo.findAllById(request.getEgzemplarzeId());

        if (egzemplarze.isEmpty()) {
            throw new RuntimeException("Brak egzemplarzy do rezerwacji");
        }

        // ===== Utwórz rezerwację =====
        Rezerwacja rezerwacja = new Rezerwacja();
        rezerwacja.setKlient(klient);
        rezerwacja.setFilia(filia);
        rezerwacja.setDataRezerwacji(LocalDate.now());
        rezerwacja.setTerminOdbioru(LocalDate.now().plusDays(7));
        rezerwacja.setStatus(StatusRezerwacji.AKTYWNA);

        // ===== Walidacja i dodanie egzemplarzy =====
        for (Egzemplarz e : egzemplarze) {

            if (!e.getFilia().getIdFilii().equals(filia.getIdFilii())) {
                throw new RuntimeException(
                        "Egzemplarz " + e.getIdEgzemplarza() +
                                " nie należy do filii " + filia.getNazwa());
            }

            if (!e.getStatus().equals(StatusEgzemplarza.DOSTEPNY)) {
                throw new RuntimeException(
                        "Egzemplarz " + e.getIdEgzemplarza() +
                                " nie jest dostępny");
            }

            e.setStatus(StatusEgzemplarza.ZAREZERWOWANY);
            rezerwacja.addEgzemplarz(e);
        }

        // ===== Zapis rezerwacji =====
        Rezerwacja saved = rezerwacjaRepo.save(rezerwacja);

        // ===== Aktualizacja statusów egzemplarzy =====
        egzemplarzRepo.saveAll(egzemplarze);

        System.out.println("Rezerwacja zakończona sukcesem: ID=" + saved.getIdRezerwacji());

        return saved;
    }
}
