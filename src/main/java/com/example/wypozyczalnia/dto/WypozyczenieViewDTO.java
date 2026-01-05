package com.example.wypozyczalnia.dto;

import com.example.wypozyczalnia.model.Wypozyczenie;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class WypozyczenieViewDTO {

    private Long idWypozyczenia;
    private LocalDate dataWypozyczenia;
    private LocalDate terminZwrotu;
    private LocalDate dataZwrotu;
    private List<EgzemplarzDto> egzemplarze;

    public WypozyczenieViewDTO(Long idWypozyczenia, LocalDate dataWypozyczenia,
                               LocalDate terminZwrotu, LocalDate dataZwrotu,
                               List<EgzemplarzDto> egzemplarze) {
        this.idWypozyczenia = idWypozyczenia;
        this.dataWypozyczenia = dataWypozyczenia;
        this.terminZwrotu = terminZwrotu;
        this.dataZwrotu = dataZwrotu;
        this.egzemplarze = egzemplarze;
    }

    // Gettery i Settery
    public Long getIdWypozyczenia() { return idWypozyczenia; }
    public void setIdWypozyczenia(Long idWypozyczenia) { this.idWypozyczenia = idWypozyczenia; }

    public LocalDate getDataWypozyczenia() { return dataWypozyczenia; }
    public void setDataWypozyczenia(LocalDate dataWypozyczenia) { this.dataWypozyczenia = dataWypozyczenia; }

    public LocalDate getTerminZwrotu() { return terminZwrotu; }
    public void setTerminZwrotu(LocalDate terminZwrotu) { this.terminZwrotu = terminZwrotu; }

    public LocalDate getDataZwrotu() { return dataZwrotu; }
    public void setDataZwrotu(LocalDate dataZwrotu) { this.dataZwrotu = dataZwrotu; }

    public List<EgzemplarzDto> getEgzemplarze() { return egzemplarze; }
    public void setEgzemplarze(List<EgzemplarzDto> egzemplarze) { this.egzemplarze = egzemplarze; }

    // ===== Konwersja z encji na DTO =====
    public static WypozyczenieViewDTO fromEntity(Wypozyczenie wypozyczenie) {
        List<EgzemplarzDto> egzemplarzeDto = wypozyczenie.getEgzemplarze()
                .stream()
                .map(e -> new EgzemplarzDto(
                        e.getIdEgzemplarza(),
                        e.getStatus().name(),
                        e.getFilia() != null ? e.getFilia().getIdFilii() : null,
                        e.getFilia() != null ? e.getFilia().getNazwa() : "-",
                        e.getFilm() != null ? e.getFilm().getTytul() : "-"
                ))
                .collect(Collectors.toList());

        return new WypozyczenieViewDTO(
                wypozyczenie.getIdWypozyczenia(),
                wypozyczenie.getDataWypozyczenia(),
                wypozyczenie.getTerminZwrotu(),
                wypozyczenie.getDataZwrotu(),
                egzemplarzeDto
        );
    }
}
