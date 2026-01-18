package com.example.film.controller;

import com.example.film.model.Filia;
import com.example.film.repository.FiliaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/filie")
@CrossOrigin(origins = "http://localhost:3000")
public class FiliaController {

    private final FiliaRepository filiaRepo;

    public FiliaController(FiliaRepository filiaRepo) {
        this.filiaRepo = filiaRepo;
    }

    @GetMapping
    public List<Filia> getAllFilie() {
        return filiaRepo.findAll();
    }
}
