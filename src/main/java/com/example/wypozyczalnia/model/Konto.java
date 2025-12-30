package com.example.wypozyczalnia.model;

import jakarta.persistence.*;

@Entity
@Table(name = "konto")
public class Konto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String login;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String haslo;

    @Column(nullable = false)
    private String rola;

    @OneToOne
    @JoinColumn(name = "id_pracownika", unique = true)
    private Pracownik pracownik;

    @OneToOne
    @JoinColumn(name = "id_klienta", unique = true)
    private Klient klient;

    public Konto() {}

    public Konto(String login, String email, String haslo, String rola) {
        this.login = login;
        this.email = email;
        this.haslo = haslo;
        this.rola = rola;
    }

    // Gettery i Settery
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLogin() { return login; }
    public void setLogin(String login) { this.login = login; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getHaslo() { return haslo; }
    public void setHaslo(String haslo) { this.haslo = haslo; }

    public String getRola() { return rola; }
    public void setRola(String rola) { this.rola = rola; }

    public Pracownik getPracownik() { return pracownik; }
    public void setPracownik(Pracownik pracownik) { this.pracownik = pracownik; }

    public Klient getKlient() { return klient; }
    public void setKlient(Klient klient) { this.klient = klient; }
}
