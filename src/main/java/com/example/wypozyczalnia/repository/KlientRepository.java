package com.example.wypozyczalnia.repository;

import com.example.wypozyczalnia.model.Klient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KlientRepository extends JpaRepository<Klient, Long> {}
