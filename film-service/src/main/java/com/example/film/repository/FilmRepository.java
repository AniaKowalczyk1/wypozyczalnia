package com.example.film.repository;

import com.example.film.model.Film;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FilmRepository extends JpaRepository<Film, Long> {

    @Query(value = """
        SELECT f.* FROM Film f
        JOIN Egzemplarz e ON f.id_filmu = e.id_filmu
        JOIN Wypozyczenie_Egzemplarz we ON e.id_egzemplarza = we.id_egzemplarza
        GROUP BY f.id_filmu
        ORDER BY COUNT(we.*) DESC
        """, nativeQuery = true)
    List<Film> findTop3MostPopular(Pageable pageable);
}