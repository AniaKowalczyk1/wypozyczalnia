package com.example.auth.repository;

import com.example.auth.model.Klient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KlientRepository extends JpaRepository<Klient, Long> {
    List<Klient> findByImieIgnoreCaseAndNazwiskoIgnoreCase(String imie, String nazwisko);
}