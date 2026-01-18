package com.example.auth.dto;

public class LoginRequest {
    private String login;
    private String haslo;

    public String getLogin() {
        return login;
    }
    public void setLogin(String login) {
        this.login = login;
    }

    public String getHaslo() {
        return haslo;
    }
    public void setHaslo(String haslo) {
        this.haslo = haslo;
    }
}
