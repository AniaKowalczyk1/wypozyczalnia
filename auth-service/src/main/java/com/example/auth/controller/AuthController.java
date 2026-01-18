package com.example.auth.controller;

import com.example.auth.model.Konto;
import com.example.auth.dto.RegisterRequest;
import com.example.auth.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ================= REJESTRACJA =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            authService.registerClient(
                    request.getImie(),
                    request.getNazwisko(),
                    request.getAdres(),
                    request.getLogin(),
                    request.getEmail(),
                    request.getHaslo()
            );

            return ResponseEntity.ok(new ApiResponse("Rejestracja zakończona sukcesem"));

        } catch (ResponseStatusException e) {
            // Konflikt login/email
            return ResponseEntity.status(e.getStatusCode())
                    .body(new ApiResponse(e.getReason()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Błąd serwera"));
        }
    }

    // ================= DTO ODPOWIEDZI =================
    static class ApiResponse {
        private String message;

        public ApiResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
