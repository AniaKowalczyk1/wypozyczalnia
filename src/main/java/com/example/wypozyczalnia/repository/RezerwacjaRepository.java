package com.example.wypozyczalnia.repository;

import com.example.wypozyczalnia.model.Rezerwacja;
import com.example.wypozyczalnia.model.StatusRezerwacji;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RezerwacjaRepository extends JpaRepository<Rezerwacja, Long> {

    List<Rezerwacja> findByKlientIdKlienta(Long idKlienta);

    List<Rezerwacja> findByKlientIdKlientaAndStatus(Long idKlienta, StatusRezerwacji status);

    List<Rezerwacja> findByKlientIdKlientaAndStatusNot(Long idKlienta, StatusRezerwacji status);
}
