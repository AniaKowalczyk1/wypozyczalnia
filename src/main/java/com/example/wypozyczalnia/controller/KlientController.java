package com.example.wypozyczalnia.controller;

import com.example.wypozyczalnia.model.Klient;
import com.example.wypozyczalnia.model.Konto;
import com.example.wypozyczalnia.repository.KontoRepository;
import com.example.wypozyczalnia.repository.KlientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/klient")
public class KlientController {

    private final KontoRepository kontoRepo;
    private final KlientRepository klientRepo;
    private static final Logger logger = LoggerFactory.getLogger(KlientController.class);

    public KlientController(KontoRepository kontoRepo, KlientRepository klientRepo) {
        this.kontoRepo = kontoRepo;
        this.klientRepo = klientRepo;
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

    @GetMapping("/search")
    public ResponseEntity<?> searchCustomer(@RequestParam String imie, @RequestParam String nazwisko) {
        List<Klient> klienci = klientRepo.findByImieIgnoreCaseAndNazwiskoIgnoreCase(imie.trim(), nazwisko.trim());

        if (klienci.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Nie znaleziono klienta"));
        }

        Klient k = klienci.get(0);
        Map<String, Object> details = new HashMap<>();
        details.put("idKlienta", k.getIdKlienta()); // DODAJ TO!
        details.put("idKonta", k.getKonto() != null ? k.getKonto().getId() : null);
        details.put("imie", k.getImie());
        details.put("nazwisko", k.getNazwisko());
        details.put("adres", k.getAdres());

        return ResponseEntity.ok(details);
    }


    @PostMapping("/quick-register")
    @Transactional
    public ResponseEntity<?> quickRegister(@RequestBody Map<String, String> data) {
        String imie = data.get("imie");
        String nazwisko = data.get("nazwisko");
        String adres = data.get("adres");

        // Tworzymy nowy profil klienta (jeszcze nie zapisujemy)
        Klient nowyKlient = new Klient();
        nowyKlient.setImie(imie);
        nowyKlient.setNazwisko(nazwisko);
        nowyKlient.setAdres(adres);

        nowyKlient = klientRepo.save(nowyKlient);

        // Tworzymy konto
        Konto noweKonto = new Konto();
        noweKonto.setLogin((imie + "." + nazwisko + (int)(Math.random()*100)).toLowerCase());
        noweKonto.setHaslo("start123");
        noweKonto.setRola("klient");
        noweKonto.setEmail(noweKonto.getLogin() + "@vhs.pl");

        // Łączymy relacje
        noweKonto.setKlient(nowyKlient);

        // Zapisujemy konto
        noweKonto = kontoRepo.save(noweKonto);

        // Wymuszamy zapis, aby baza nadała ID i powiązała rekordy
        klientRepo.flush();
        kontoRepo.flush();

        Map<String, Object> response = new HashMap<>();
        response.put("idKonta", noweKonto.getId());
        response.put("imie", imie);
        response.put("nazwisko", nazwisko);
        response.put("adres", adres);

        return ResponseEntity.ok(response);
    }

}
