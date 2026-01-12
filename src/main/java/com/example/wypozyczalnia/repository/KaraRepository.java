package com.example.wypozyczalnia.repository;

import com.example.wypozyczalnia.model.Kara;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KaraRepository extends JpaRepository<Kara, Long> {

    // Szuka kary powiązanej z konkretnym wypożyczeniem
    Optional<Kara> findByWypozyczenieIdWypozyczenia(Long idWypozyczenia);
}