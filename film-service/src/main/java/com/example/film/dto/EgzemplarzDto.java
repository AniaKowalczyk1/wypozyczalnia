package com.example.film.dto;

public class EgzemplarzDto {
    private Long idEgzemplarza;
    private String status;
    private Long filiaId;
    private String filiaNazwa;
    private String filmTytul;

    public EgzemplarzDto(Long idEgzemplarza, String status, Long filiaId, String filiaNazwa, String filmTytul) {
        this.idEgzemplarza = idEgzemplarza;
        this.status = status;
        this.filiaId = filiaId;
        this.filiaNazwa = filiaNazwa != null ? filiaNazwa : "-"; // zabezpieczenie przed null
        this.filmTytul = filmTytul;
    }

    // Gettery i Settery
    public Long getIdEgzemplarza() { return idEgzemplarza; }
    public void setIdEgzemplarza(Long idEgzemplarza) { this.idEgzemplarza = idEgzemplarza; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getFiliaId() { return filiaId; }
    public void setFiliaId(Long filiaId) { this.filiaId = filiaId; }

    public String getFiliaNazwa() { return filiaNazwa; }
    public void setFiliaNazwa(String filiaNazwa) { this.filiaNazwa = filiaNazwa; }

    public String getFilmTytul() { return filmTytul; }
    public void setFilmTytul(String filmTytul) { this.filmTytul = filmTytul; }
}
