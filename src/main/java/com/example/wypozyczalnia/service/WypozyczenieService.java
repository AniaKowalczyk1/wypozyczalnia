package com.example.wypozyczalnia.service;

import com.example.wypozyczalnia.dto.ReserveRequest;
import com.example.wypozyczalnia.dto.WypozyczenieRequest;
import com.example.wypozyczalnia.model.*;
import com.example.wypozyczalnia.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class WypozyczenieService {

    private final WypozyczenieRepository wypozyczenieRepo;
    private final EgzemplarzRepository egzemplarzRepo;
    private final KontoRepository kontoRepo;
    private final FiliaRepository filiaRepo;
    private final KlientRepository klientRepo;
    private final PlatnoscRepository platnoscRepo;


    public WypozyczenieService(
            WypozyczenieRepository wypozyczenieRepo,
            EgzemplarzRepository egzemplarzRepo,
            KontoRepository kontoRepo,
            FiliaRepository filiaRepo,
            KlientRepository klientRepo,
            PlatnoscRepository platnoscRepo
    ) {
        this.wypozyczenieRepo = wypozyczenieRepo;
        this.egzemplarzRepo = egzemplarzRepo;
        this.kontoRepo = kontoRepo;
        this.filiaRepo = filiaRepo;
        this.klientRepo = klientRepo;
        this.platnoscRepo = platnoscRepo;
    }

    @Transactional
    public Wypozyczenie createWypozyczenie(WypozyczenieRequest request) {
        System.out.println("===== Nowe wypożyczenie =====");
        System.out.println("Request: " + request);

        // ===== Pobierz konto i klienta =====
        Konto konto = kontoRepo.findById(request.getIdKonta())
                .orElseThrow(() -> new RuntimeException("Nie znaleziono konta: " + request.getIdKonta()));

        Klient klient = konto.getKlient();
        if (klient == null)
            throw new RuntimeException("Konto nie jest powiązane z klientem: " + request.getIdKonta());

        // ===== Pobierz filię =====
        Filia filia = filiaRepo.findById(request.getIdFilii())
                .orElseThrow(() -> new RuntimeException("Nie znaleziono filii: " + request.getIdFilii()));

        // ===== Stwórz wypożyczenie =====
        Wypozyczenie wypozyczenie = new Wypozyczenie();
        wypozyczenie.setKlient(klient);
        wypozyczenie.setFilia(filia);
        wypozyczenie.setDataWypozyczenia(LocalDate.now());
        wypozyczenie.setTerminZwrotu(LocalDate.parse(request.getTerminZwrotu()));

        // ===== Obsługa dostawy =====
        if ("dom".equalsIgnoreCase(request.getDostawa()) && request.getAdresDostawy() != null) {
            klient.setAdres(request.getAdresDostawy());
            klientRepo.save(klient);
            System.out.println("Adres dostawy ustawiony na: " + klient.getAdres());
        } else {
            System.out.println("Odbiór w filii: " + filia.getAdres());
        }

        // ===== Pobierz egzemplarze =====
        List<Egzemplarz> egzemplarze = egzemplarzRepo.findAllById(request.getEgzemplarzeId());
        if (egzemplarze.isEmpty())
            throw new RuntimeException("Brak egzemplarzy do wypożyczenia");

        // ===== Sprawdź dostępność i dodaj do wypożyczenia =====
        for (Egzemplarz e : egzemplarze) {
            if (!e.getStatus().equals(StatusEgzemplarza.DOSTEPNY)) {
                throw new RuntimeException("Egzemplarz " + e.getIdEgzemplarza() + " nie jest dostępny");
            }
            e.setStatus(StatusEgzemplarza.WYPOZYCZONY);
            wypozyczenie.addEgzemplarz(e);
        }

        // ===== Zapisz wypożyczenie =====
        Wypozyczenie saved = wypozyczenieRepo.save(wypozyczenie);

        // ===== Zapisz zmienione statusy egzemplarzy =====
        egzemplarzRepo.saveAll(egzemplarze);

        // ===== Tworzenie płatności =====

        BigDecimal kwotaPlatnosci = BigDecimal.valueOf(calculatePrice(egzemplarze.size()));
        if ("dom".equalsIgnoreCase(request.getDostawa())) {
            kwotaPlatnosci = kwotaPlatnosci.add(BigDecimal.valueOf(12.99));
        }

        Platnosc platnosc = new Platnosc();
        platnosc.setKwota(kwotaPlatnosci);
        platnosc.setDataPlatnosci(LocalDate.now());
        platnosc.setMetoda("BLIK");
        platnosc.setWypozyczenie(saved);

        platnoscRepo.save(platnosc);


        System.out.println("Wypożyczenie zakończone sukcesem: ID=" + saved.getIdWypozyczenia());
        System.out.println("Płatność utworzona: ID=" + platnosc.getIdPlatnosci() + ", kwota=" + kwotaPlatnosci);

        return saved;
    }

    // ===== Metoda pomocnicza do obliczania ceny =====
    private double calculatePrice(int numFilms) {
        if (numFilms == 1) return 10.0 * numFilms;
        if (numFilms >= 2 && numFilms <= 3) return 9.0 * numFilms;
        if (numFilms >= 4 && numFilms <= 6) return 8.0 * numFilms;
        return 7.0 * numFilms;
    }

    @Transactional
    public void returnWypozyczenie(Long idWypozyczenia) {
        Wypozyczenie wypozyczenie = wypozyczenieRepo.findById(idWypozyczenia)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono wypożyczenia"));

        if (wypozyczenie.getDataZwrotu() != null) {
            throw new RuntimeException("To wypożyczenie zostało już zwrócone");
        }

        LocalDate dzisiaj = LocalDate.now();
        wypozyczenie.setDataZwrotu(dzisiaj);

        for (Egzemplarz e : wypozyczenie.getEgzemplarze()) {
            e.setStatus(StatusEgzemplarza.DOSTEPNY);
            egzemplarzRepo.save(e);
        }

        if (dzisiaj.isAfter(wypozyczenie.getTerminZwrotu())) {
            long dniSpoznienia = java.time.temporal.ChronoUnit.DAYS.between(wypozyczenie.getTerminZwrotu(), dzisiaj);
            Kara kara = new Kara();
            kara.setDniSpoznienia((int) dniSpoznienia);
            kara.setKwotaZaDzien(5.0); // np. 5 zł
            kara.setKwotaCalkowita(dniSpoznienia * 5.0);
            kara.setOplacone(false);
            kara.setWypozyczenie(wypozyczenie);
            wypozyczenie.setKara(kara);
        }

        wypozyczenieRepo.save(wypozyczenie);
    }

    public double obliczAktualnaKare(Wypozyczenie w) {
        if (w.getTerminZwrotu() == null) return 0.0;

        LocalDate dzisiaj = LocalDate.now();
        if (dzisiaj.isAfter(w.getTerminZwrotu())) {
            long dni = java.time.temporal.ChronoUnit.DAYS.between(w.getTerminZwrotu(), dzisiaj);
            return dni * 5.0;
        }
        return 0.0;
    }
}


