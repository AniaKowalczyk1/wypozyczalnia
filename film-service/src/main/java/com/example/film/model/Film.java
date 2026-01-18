package com.example.film.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Film {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFilmu;

    private String tytul;
    private String gatunek;
    private int rokWydania;
    private String rezyser;
    private String opis;
    private String plakat;

    @OneToMany(mappedBy = "film", cascade = CascadeType.ALL)
    private List<Egzemplarz> egzemplarze = new ArrayList<>();

    public Long getIdFilmu() { return idFilmu; }
    public void setIdFilmu(Long idFilmu) { this.idFilmu = idFilmu; }

    public String getTytul() { return tytul; }
    public void setTytul(String tytul) { this.tytul = tytul; }

    public String getGatunek() { return gatunek; }
    public void setGatunek(String gatunek) { this.gatunek = gatunek; }

    public int getRokWydania() { return rokWydania; }
    public void setRokWydania(int rokWydania) { this.rokWydania = rokWydania; }

    public String getRezyser() { return rezyser; }
    public void setRezyser(String rezyser) { this.rezyser = rezyser; }

    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }

    public String getPlakat() { return plakat; }
    public void setPlakat(String plakat) { this.plakat = plakat; }

    public List<Egzemplarz> getEgzemplarze() { return egzemplarze; }
    public void setEgzemplarze(List<Egzemplarz> egzemplarze) { this.egzemplarze = egzemplarze; }
}