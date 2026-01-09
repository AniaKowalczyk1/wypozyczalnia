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

    public RezerwacjaService(RezerwacjaRepository rezerwacjaRepo,
                             EgzemplarzRepository egzemplarzRepo,
                             KontoRepository kontoRepo) {
        this.rezerwacjaRepo = rezerwacjaRepo;
        this.egzemplarzRepo = egzemplarzRepo;
        this.kontoRepo = kontoRepo;
    }

    @Transactional
    public Rezerwacja createRezerwacja(ReserveRequest request) {
        Konto konto = kontoRepo.findById(request.getIdKonta())
                .orElseThrow(() -> new RuntimeException("Nie znaleziono konta: " + request.getIdKonta()));

        Klient klient = konto.getKlient();
        if (klient == null)
            throw new RuntimeException("Konto nie jest powiązane z klientem: " + request.getIdKonta());

        List<Egzemplarz> egzemplarze = egzemplarzRepo.findAllById(request.getEgzemplarzeId());
        if (egzemplarze.isEmpty())
            throw new RuntimeException("Brak egzemplarzy do rezerwacji");

        Rezerwacja rezerwacja = new Rezerwacja();
        rezerwacja.setKlient(klient);
        rezerwacja.setDataRezerwacji(LocalDate.now());
        rezerwacja.setTerminOdbioru(LocalDate.now().plusDays(7));
        rezerwacja.setStatus(StatusRezerwacji.AKTYWNA);

        for (Egzemplarz e : egzemplarze) {
            if (!e.getStatus().equals(StatusEgzemplarza.DOSTEPNY)) {
                throw new RuntimeException("Egzemplarz " + e.getIdEgzemplarza() + " nie jest dostępny");
            }
            e.setStatus(StatusEgzemplarza.ZAREZERWOWANY);
            rezerwacja.addEgzemplarz(e);
        }

        // Zapisz rezerwację i zaktualizuj egzemplarze
        Rezerwacja saved = rezerwacjaRepo.save(rezerwacja);
        System.out.println("Rezerwacja zakończona sukcesem: ID=" + saved.getIdRezerwacji());

        egzemplarzRepo.saveAll(egzemplarze);

        return saved;
    }
}
