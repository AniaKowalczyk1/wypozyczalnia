package com.example.film.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOrigins(List.of("http://localhost:3000"));
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(List.of("*"));
                    config.setAllowCredentials(true);
                    return config;
                }))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Kolejność: najpierw najbardziej szczegółowe, potem ogólne
                        .requestMatchers("/api/films/popular", "/api/films/popular/**").permitAll()
                        .requestMatchers("/api/films/**").permitAll()
                        .requestMatchers("/api/filie/**").permitAll()
                        .requestMatchers("/api/admin/egzemplarze/**").permitAll()
                        .requestMatchers("/api/admin/films/**").permitAll()
                        .anyRequest().authenticated()
                );
        return http.build();
    }
}