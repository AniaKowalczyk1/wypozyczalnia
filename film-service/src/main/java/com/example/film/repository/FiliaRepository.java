package com.example.film.repository;

import com.example.film.model.Filia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FiliaRepository extends JpaRepository<Filia, Long> {
}
