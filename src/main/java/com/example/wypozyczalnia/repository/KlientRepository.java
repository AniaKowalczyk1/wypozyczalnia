package com.example.wypozyczalnia.repository;

import com.example.wypozyczalnia.model.Klient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KlientRepository extends JpaRepository<Klient, Long> {
    List<Klient> findByImieIgnoreCaseAndNazwiskoIgnoreCase(String imie, String nazwisko);
}