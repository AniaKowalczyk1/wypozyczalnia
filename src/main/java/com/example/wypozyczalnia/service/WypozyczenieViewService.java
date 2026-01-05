package com.example.wypozyczalnia.service;

import com.example.wypozyczalnia.dto.WypozyczenieViewDTO;
import com.example.wypozyczalnia.model.Wypozyczenie;
import com.example.wypozyczalnia.repository.WypozyczenieRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WypozyczenieViewService {

    private final WypozyczenieRepository wypozyczenieRepository;

    public WypozyczenieViewService(WypozyczenieRepository wypozyczenieRepository) {
        this.wypozyczenieRepository = wypozyczenieRepository;
    }

    @Transactional(readOnly = true) // ważne przy Lazy fetch
    public List<WypozyczenieViewDTO> getAllRentals(Long idKlienta) {
        List<Wypozyczenie> wypozyczenia = wypozyczenieRepository.findByKlientIdKlienta(idKlienta);
        return wypozyczenia.stream()
                .map(WypozyczenieViewDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<WypozyczenieViewDTO> getActiveRentals(Long idKlienta) {
        List<Wypozyczenie> wypozyczenia = wypozyczenieRepository.findByKlientIdKlientaAndDataZwrotuIsNull(idKlienta);
        return wypozyczenia.stream()
                .map(WypozyczenieViewDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<WypozyczenieViewDTO> getPastRentals(Long idKlienta) {
        List<Wypozyczenie> wypozyczenia = wypozyczenieRepository.findByKlientIdKlientaAndDataZwrotuIsNotNull(idKlienta);
        return wypozyczenia.stream()
                .map(WypozyczenieViewDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
