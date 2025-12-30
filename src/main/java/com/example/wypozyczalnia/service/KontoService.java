package com.example.wypozyczalnia.service;

import com.example.wypozyczalnia.model.Konto;
import com.example.wypozyczalnia.repository.KontoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class KontoService {

    private final KontoRepository kontoRepository;

    @Autowired
    public KontoService(KontoRepository kontoRepository) {
        this.kontoRepository = kontoRepository;
    }

    public boolean authenticate(String login, String haslo) {
        return kontoRepository.findByLogin(login)
                .map(konto -> haslo != null && haslo.equals(konto.getHaslo()))
                .orElse(false);
    }

    public Konto getKontoByLogin(String login) {
        return kontoRepository.findByLogin(login).orElse(null);
    }
}
