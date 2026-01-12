package com.example.wypozyczalnia.service;

import com.example.wypozyczalnia.dto.KaraDto;
import com.example.wypozyczalnia.model.Kara;
import com.example.wypozyczalnia.model.Wypozyczenie;
import com.example.wypozyczalnia.repository.KaraRepository;
import com.example.wypozyczalnia.repository.WypozyczenieRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class KaraServiceView {

    private final WypozyczenieRepository wypozyczenieRepository;
    private final KaraRepository karaRepository;


    public KaraServiceView(WypozyczenieRepository wypozyczenieRepository,
                       KaraRepository karaRepository) {
        this.wypozyczenieRepository = wypozyczenieRepository;
        this.karaRepository = karaRepository;
    }

    /**
     * Aktualizuje kary dla wszystkich wypożyczeń klienta.
     * Tworzy nowe kary, jeśli spóźnienie > 0, i aktualizuje istniejące.
     * Zwraca listę DTO z aktualnymi danymi.
     */
    public List<KaraDto> aktualizujKaryDlaKlienta(Long idKlienta) {
        List<Wypozyczenie> wypozyczenia = wypozyczenieRepository.findByKlientIdKlienta(idKlienta);

        LocalDate dzisiaj = LocalDate.now();

        return wypozyczenia.stream()
                .map(w -> {
                    int dniSpoznienia = 0;

                    // Obliczanie dni spóźnienia
                    if (w.getDataZwrotu() != null) {
                        dniSpoznienia = (int) ChronoUnit.DAYS.between(w.getTerminZwrotu(), w.getDataZwrotu());
                    } else if (dzisiaj.isAfter(w.getTerminZwrotu())) {
                        dniSpoznienia = (int) ChronoUnit.DAYS.between(w.getTerminZwrotu(), dzisiaj);
                    }
                    dniSpoznienia = Math.max(dniSpoznienia, 0);

                    // Aktualizacja lub tworzenie rekordu Kara
                    Kara kara = w.getKara();
                    double stawkaZaDzien = 5.0;

                    if (kara != null) {
                        kara.setDniSpoznienia(dniSpoznienia);
                        kara.setKwotaZaDzien(stawkaZaDzien);
                        kara.setKwotaCalkowita(dniSpoznienia * stawkaZaDzien);
                        karaRepository.save(kara);
                    } else if (dniSpoznienia > 0) {
                        kara = new Kara();
                        kara.setWypozyczenie(w);
                        kara.setDniSpoznienia(dniSpoznienia);
                        kara.setKwotaZaDzien(stawkaZaDzien);
                        kara.setKwotaCalkowita(dniSpoznienia * stawkaZaDzien);
                        kara.setOplacone(false);
                        karaRepository.save(kara);
                    }


                    // Tworzenie DTO
                    KaraDto dto = new KaraDto();
                    dto.setIdWypozyczenia(w.getIdWypozyczenia());
                    dto.setTytul(
                            w.getEgzemplarze().isEmpty()
                                    ? "Brak danych"
                                    : w.getEgzemplarze().stream()
                                    .map(e -> e.getFilm().getTytul())
                                    .collect(Collectors.joining(", ")) // połącz wszystkie tytuły przecinkami
                    );
                    dto.setTerminZwrotu(w.getTerminZwrotu());
                    dto.setDniSpoznienia(dniSpoznienia);
                    dto.setKwotaCalkowita(dniSpoznienia * 5.0);
                    dto.setOplacone(kara != null ? kara.getOplacone() : false);

                    return dto;
                })
                // filtrujemy tylko te wypożyczenia, które mają spóźnienie lub już istniejącą opłaconą karę
                .filter(dto -> dto.getDniSpoznienia() > 0 || dto.getOplacone())
                .collect(Collectors.toList());
    }


}
