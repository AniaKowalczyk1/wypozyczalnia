package com.example.film.repository;

import com.example.film.model.Egzemplarz;
import com.example.film.model.Film;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EgzemplarzRepository extends JpaRepository<Egzemplarz, Long> {

    // Pobiera egzemplarze danego filmu
    List<Egzemplarz> findByFilm(Film film);

    // Pobiera egzemplarze po ID wraz z powiązaną filią
    @Query("SELECT e FROM Egzemplarz e JOIN FETCH e.filia WHERE e.idEgzemplarza IN :ids")
    List<Egzemplarz> findAllByIdWithFilia(List<Long> ids);
}
