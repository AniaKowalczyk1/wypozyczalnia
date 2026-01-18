//package com.example.wypozyczalnia.controller;
//
//import com.example.wypozyczalnia.dto.FilmAvailabilityDto;
//import com.example.wypozyczalnia.service.FilmService;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/films")
//@CrossOrigin(origins = "http://localhost:3000")
//public class FilmController {
//
//    private final FilmService filmService;
//
//    public FilmController(FilmService filmService) {
//        this.filmService = filmService;
//    }
//
//    @GetMapping
//    public List<FilmAvailabilityDto> getAllFilms() {
//        return filmService.getAllFilmsWithStatus();
//    }
//
//    @GetMapping("/popular")
//    public List<FilmAvailabilityDto> getTopPopularFilms() {
//        return filmService.getTop3PopularFilms();
//    }
//
//}
