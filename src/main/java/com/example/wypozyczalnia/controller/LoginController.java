//package com.example.wypozyczalnia.controller;
//
//import com.example.wypozyczalnia.dto.LoginRequest;
//import com.example.wypozyczalnia.model.Konto;
//import com.example.wypozyczalnia.service.KontoService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@CrossOrigin(origins = "http://localhost:3000")
//@RestController
//@RequestMapping("/api/login")
//public class LoginController {
//
//    private final KontoService kontoService;
//
//    @Autowired
//    public LoginController(KontoService kontoService) {
//        this.kontoService = kontoService;
//    }
//
//    @PostMapping
//    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
//        Konto konto = kontoService.getKontoByLogin(request.getLogin());
//
//        if (konto == null || !kontoService.authenticate(request.getLogin(), request.getHaslo())) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body("Nieprawidłowy login lub hasło");
//        }
//
//        // Ustawienie uwierzytelnienia w SecurityContext
//        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
//                konto.getLogin(),
//                null,
//                List.of(new SimpleGrantedAuthority(konto.getRola()))
//        );
//        SecurityContextHolder.getContext().setAuthentication(auth);
//
//        // Przygotowanie pełnych danych klienta
//        Map<String, Object> response = new HashMap<>();
//        response.put("idKonta", konto.getId());
//        response.put("login", konto.getLogin());
//        response.put("email", konto.getEmail());
//        response.put("rola", konto.getRola());
//
//        if (konto.getKlient() != null) {
//            // Dane dla klienta
//            response.put("idKlienta", konto.getKlient().getIdKlienta());
//            response.put("imie", konto.getKlient().getImie());
//            response.put("nazwisko", konto.getKlient().getNazwisko());
//            response.put("adres", konto.getKlient().getAdres());
//        } else if (konto.getPracownik() != null) {
//            // Dane dla admina
//            response.put("idFilii", konto.getPracownik().getFilia().getIdFilii());
//            response.put("nazwaFilii", konto.getPracownik().getFilia().getNazwa());
//        }
//
//        return ResponseEntity.ok(response);
//    }
//}
