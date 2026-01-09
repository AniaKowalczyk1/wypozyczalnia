package com.example.wypozyczalnia.service;

import com.example.wypozyczalnia.dto.KaraDto;
import com.example.wypozyczalnia.model.Wypozyczenie;
import com.example.wypozyczalnia.repository.WypozyczenieRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class KaraService {

    private final WypozyczenieRepository wypozyczenieRepository;

    public KaraService(WypozyczenieRepository wypozyczenieRepository) {
        this.wypozyczenieRepository = wypozyczenieRepository;
    }

    public List<KaraDto> getKaryDlaKlienta(Long idKlienta) {
        // Pobieramy wszystkie wypożyczenia klienta
        List<Wypozyczenie> wypozyczenia = wypozyczenieRepository.findByKlientIdKlienta(idKlienta);

        return wypozyczenia.stream()
                .map(w -> {
                    KaraDto dto = new KaraDto();
                    dto.setIdWypozyczenia(w.getIdWypozyczenia());
                    dto.setTytul(
                            w.getEgzemplarze().isEmpty()
                                    ? "Brak danych"
                                    : w.getEgzemplarze().get(0).getFilm().getTytul()
                    );
                    dto.setTerminZwrotu(w.getTerminZwrotu());

                    // Liczymy dni spóźnienia dynamicznie
                    int dniSpoznienia = 0;
                    LocalDate dzisiaj = LocalDate.now();

                    if (w.getDataZwrotu() != null) {
                        dniSpoznienia = (int) ChronoUnit.DAYS.between(w.getTerminZwrotu(), w.getDataZwrotu());
                    } else if (dzisiaj.isAfter(w.getTerminZwrotu())) {
                        dniSpoznienia = (int) ChronoUnit.DAYS.between(w.getTerminZwrotu(), dzisiaj);
                    }

                    dto.setDniSpoznienia(Math.max(dniSpoznienia, 0));

                    // Kwota kary (np. 5 zł/dzień)
                    dto.setKwotaCalkowita(dto.getDniSpoznienia() * 5.0);

                    // Jeżeli istnieje rekord Kara (po oddaniu), sprawdzamy status opłacone
                    dto.setOplacone(w.getKara() != null ? w.getKara().getOplacone() : false);

                    return dto;
                })
                // Filtrujemy tylko te wypożyczenia, które mają dni spóźnienia > 0 lub rekord Kara istnieje
                .filter(dto -> dto.getDniSpoznienia() > 0 || dto.getOplacone())
                .collect(Collectors.toList());
    }
}
