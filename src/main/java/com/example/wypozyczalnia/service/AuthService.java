//package com.example.wypozyczalnia.service;
//
//import com.example.wypozyczalnia.model.Klient;
//import com.example.wypozyczalnia.model.Konto;
//import com.example.wypozyczalnia.repository.KlientRepository;
//import com.example.wypozyczalnia.repository.KontoRepository;
//import org.springframework.stereotype.Service;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.server.ResponseStatusException;
//import org.springframework.http.HttpStatus;
//
//@Service
//public class AuthService {
//
//    private final KlientRepository klientRepository;
//    private final KontoRepository kontoRepository;
//
//    @Autowired
//    public AuthService(KlientRepository klientRepository, KontoRepository kontoRepository) {
//        this.klientRepository = klientRepository;
//        this.kontoRepository = kontoRepository;
//    }
//
//    public Konto registerClient(
//            String imie,
//            String nazwisko,
//            String adres,
//            String login,
//            String email,
//            String haslo
//    ) {
//
//        // login unikalny
//        if (kontoRepository.findByLogin(login).isPresent()) {
//            throw new ResponseStatusException(HttpStatus.CONFLICT, "Login jest już zajęty");
//        }
//
//        // email unikalny
//        if (kontoRepository.findByEmail(email).isPresent()) {
//            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email jest już zajęty");
//        }
//
//        // Klient
//        Klient klient = new Klient();
//        klient.setImie(imie);
//        klient.setNazwisko(nazwisko);
//        klient.setAdres(adres);
//
//        klient = klientRepository.save(klient);
//
//        // Konto
//        Konto konto = new Konto();
//        konto.setLogin(login);
//        konto.setEmail(email);
//        konto.setHaslo(haslo);
//        konto.setRola("klient");
//        konto.setKlient(klient);
//        konto.setPracownik(null);
//
//        return kontoRepository.save(konto);
//    }
//}
