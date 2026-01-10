package com.example.wypozyczalnia.service;

import com.example.wypozyczalnia.dto.ProfilDto;
import com.example.wypozyczalnia.model.Klient;
import com.example.wypozyczalnia.model.Konto;
import com.example.wypozyczalnia.repository.KlientRepository;
import com.example.wypozyczalnia.repository.KontoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfilService {

    @Autowired
    private KlientRepository klientRepository;

    @Autowired
    private KontoRepository kontoRepository;

    public ProfilDto getProfil(Long idKlienta) {
        Optional<Klient> klientOpt = klientRepository.findById(idKlienta);
        if (klientOpt.isEmpty()) {
            throw new RuntimeException("Klient nie istnieje");
        }
        Klient klient = klientOpt.get();
        Konto konto = klient.getKonto();

        ProfilDto dto = new ProfilDto();
        dto.setIdKlienta(klient.getIdKlienta());
        dto.setImie(klient.getImie());
        dto.setNazwisko(klient.getNazwisko());
        dto.setAdres(klient.getAdres());

        if (konto != null) {
            dto.setIdKonta(konto.getId());
            dto.setLogin(konto.getLogin());
            dto.setEmail(konto.getEmail());
        }

        return dto;
    }

    public ProfilDto updateProfil(Long idKlienta, ProfilDto dto) {
        Optional<Klient> klientOpt = klientRepository.findById(idKlienta);
        if (klientOpt.isEmpty()) {
            throw new RuntimeException("Klient nie istnieje");
        }
        Klient klient = klientOpt.get();
        klient.setImie(dto.getImie());
        klient.setNazwisko(dto.getNazwisko());
        klient.setAdres(dto.getAdres());
        klientRepository.save(klient);

        Konto konto = klient.getKonto();
        if (konto != null) {
            // Login nie może być zmieniany
            konto.setEmail(dto.getEmail());
            // Zmiana hasła jeśli podano nowe
            if (dto.getHaslo() != null && !dto.getHaslo().isBlank()) {
                konto.setHaslo(dto.getHaslo());
            }
            kontoRepository.save(konto);
        }

        return getProfil(idKlienta);
    }

}
