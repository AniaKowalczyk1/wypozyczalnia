package com.example.wypozyczalnia.dto;

public class ProfilDto {

    private Long idKlienta;
    private String imie;
    private String nazwisko;
    private String adres;

    private Long idKonta;
    private String login; // tylko do odczytu
    private String email;
    private String haslo; // nowe hasło

    // Gettery i Settery
    public Long getIdKlienta() { return idKlienta; }
    public void setIdKlienta(Long idKlienta) { this.idKlienta = idKlienta; }

    public String getImie() { return imie; }
    public void setImie(String imie) { this.imie = imie; }

    public String getNazwisko() { return nazwisko; }
    public void setNazwisko(String nazwisko) { this.nazwisko = nazwisko; }

    public String getAdres() { return adres; }
    public void setAdres(String adres) { this.adres = adres; }

    public Long getIdKonta() { return idKonta; }
    public void setIdKonta(Long idKonta) { this.idKonta = idKonta; }

    public String getLogin() { return login; } // tylko odczyt
    public void setLogin(String login) { this.login = login; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getHaslo() { return haslo; }
    public void setHaslo(String haslo) { this.haslo = haslo; }
}
