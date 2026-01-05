package com.example.wypozyczalnia.repository;

import com.example.wypozyczalnia.model.Filia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FiliaRepository extends JpaRepository<Filia, Long> {
}
