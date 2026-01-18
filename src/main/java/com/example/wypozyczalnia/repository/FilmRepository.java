//package com.example.wypozyczalnia.repository;
//
//import com.example.wypozyczalnia.model.Film;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.stereotype.Repository;
//import org.springframework.data.domain.Pageable;
//import java.util.List;
//
//
//@Repository
//public interface FilmRepository extends JpaRepository<Film, Long> {
//
//    @Query("""
//        SELECT f
//        FROM Film f
//        JOIN f.egzemplarze e
//        JOIN e.wypozyczenia we
//        GROUP BY f
//        ORDER BY COUNT(we) DESC
//    """)
//    List<Film> findTop3MostPopular(Pageable pageable);
//
//}
