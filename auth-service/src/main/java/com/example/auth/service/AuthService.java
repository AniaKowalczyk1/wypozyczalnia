package com.example.auth.service;

import com.example.auth.model.Klient;
import com.example.auth.model.Konto;
import com.example.auth.repository.KlientRepository;
import com.example.auth.repository.KontoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final KlientRepository klientRepository;
    private final KontoRepository kontoRepository;

    @Autowired
    public AuthService(KlientRepository klientRepository, KontoRepository kontoRepository) {
        this.klientRepository = klientRepository;
        this.kontoRepository = kontoRepository;
    }

    public Konto registerClient(
            String imie,
            String nazwisko,
            String adres,
            String login,
            String email,
            String haslo
    ) {

        // login unikalny
        if (kontoRepository.findByLogin(login).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Login jest już zajęty");
        }

        // email unikalny
        if (kontoRepository.findByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email jest już zajęty");
        }

        // Klient
        Klient klient = new Klient();
        klient.setImie(imie);
        klient.setNazwisko(nazwisko);
        klient.setAdres(adres);

        klient = klientRepository.save(klient);

        // Konto
        Konto konto = new Konto();
        konto.setLogin(login);
        konto.setEmail(email);
        konto.setHaslo(haslo);
        konto.setRola("klient");
        konto.setKlient(klient);
        konto.setPracownik(null);

        return kontoRepository.save(konto);
    }
}
