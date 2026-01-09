package com.example.wypozyczalnia.dto;

import com.example.wypozyczalnia.model.Rezerwacja;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class RezerwacjaViewDTO {

    private Long idRezerwacji;
    private LocalDate dataRezerwacji;
    private LocalDate terminOdbioru;
    private String status;  // AKTYWNA, ODWOLANA, ZREALIZOWANA, PRZETERMINOWANA
    private List<EgzemplarzDto> egzemplarze;

    public RezerwacjaViewDTO(Long idRezerwacji, LocalDate dataRezerwacji,
                             LocalDate terminOdbioru, String status,
                             List<EgzemplarzDto> egzemplarze) {
        this.idRezerwacji = idRezerwacji;
        this.dataRezerwacji = dataRezerwacji;
        this.terminOdbioru = terminOdbioru;
        this.status = status;
        this.egzemplarze = egzemplarze;
    }

    // Gettery i Settery
    public Long getIdRezerwacji() { return idRezerwacji; }
    public void setIdRezerwacji(Long idRezerwacji) { this.idRezerwacji = idRezerwacji; }

    public LocalDate getDataRezerwacji() { return dataRezerwacji; }
    public void setDataRezerwacji(LocalDate dataRezerwacji) { this.dataRezerwacji = dataRezerwacji; }

    public LocalDate getTerminOdbioru() { return terminOdbioru; }
    public void setTerminOdbioru(LocalDate terminOdbioru) { this.terminOdbioru = terminOdbioru; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<EgzemplarzDto> getEgzemplarze() { return egzemplarze; }
    public void setEgzemplarze(List<EgzemplarzDto> egzemplarze) { this.egzemplarze = egzemplarze; }

    // Konwersja z encji na DTO
    public static RezerwacjaViewDTO fromEntity(Rezerwacja rezerwacja) {
        List<EgzemplarzDto> egzemplarzeDto = rezerwacja.getEgzemplarze()
                .stream()
                .map(e -> new EgzemplarzDto(
                        e.getIdEgzemplarza(),
                        e.getStatus().name(),
                        e.getFilia() != null ? e.getFilia().getIdFilii() : null,
                        e.getFilia() != null ? e.getFilia().getNazwa() : "-",
                        e.getFilm() != null ? e.getFilm().getTytul() : "-"
                ))
                .collect(Collectors.toList());

        return new RezerwacjaViewDTO(
                rezerwacja.getIdRezerwacji(),
                rezerwacja.getDataRezerwacji(),
                rezerwacja.getTerminOdbioru(),
                rezerwacja.getStatus().name(),
                egzemplarzeDto
        );
    }
}
