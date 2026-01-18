package com.example.auth.repository;

import com.example.auth.model.Konto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KontoRepository extends JpaRepository<Konto, Long> {
    Optional<Konto> findByLogin(String login);
    Optional<Konto> findByEmail(String email);
}
