package com.example.wypozyczalnia.repository;

import com.example.wypozyczalnia.model.Klient;
import com.example.wypozyczalnia.model.Wypozyczenie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WypozyczenieRepository extends JpaRepository<Wypozyczenie, Long> {

    // Wszystkie wypożyczenia dla danego klienta
    List<Wypozyczenie> findByKlientIdKlienta(Long idKlienta);

    // Tylko aktualne (niewrócone) wypożyczenia
    List<Wypozyczenie> findByKlientIdKlientaAndDataZwrotuIsNull(Long idKlienta);

    // Tylko przeszłe (już zwrócone) wypożyczenia
    List<Wypozyczenie> findByKlientIdKlientaAndDataZwrotuIsNotNull(Long idKlienta);

}