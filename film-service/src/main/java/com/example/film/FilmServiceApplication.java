package com.example.film;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.example.film.model")
@EnableJpaRepositories("com.example.film.repository")
public class FilmServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(FilmServiceApplication.class, args);
    }
}