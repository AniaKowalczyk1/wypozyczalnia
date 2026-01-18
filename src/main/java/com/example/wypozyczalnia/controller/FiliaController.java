//package com.example.wypozyczalnia.controller;
//
//import com.example.wypozyczalnia.model.Filia;
//import com.example.wypozyczalnia.repository.FiliaRepository;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/filie")
//@CrossOrigin(origins = "http://localhost:3000")
//public class FiliaController {
//
//    private final FiliaRepository filiaRepo;
//
//    public FiliaController(FiliaRepository filiaRepo) {
//        this.filiaRepo = filiaRepo;
//    }
//
//    @GetMapping
//    public List<Filia> getAllFilie() {
//        return filiaRepo.findAll();
//    }
//}
