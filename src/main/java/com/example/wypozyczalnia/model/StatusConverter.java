package com.example.wypozyczalnia.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class StatusConverter implements AttributeConverter<StatusEgzemplarza, String> {

    @Override
    public String convertToDatabaseColumn(StatusEgzemplarza status) {
        return switch (status) {
            case DOSTEPNY -> "dostępny";
            case WYPOZYCZONY -> "wypożyczony";
            case ZAREZERWOWANY -> "zarezerwowany";
            case USZKODZONY -> "uszkodzony";
        };
    }

    @Override
    public StatusEgzemplarza convertToEntityAttribute(String dbData) {
        return switch (dbData) {
            case "dostępny" -> StatusEgzemplarza.DOSTEPNY;
            case "wypożyczony" -> StatusEgzemplarza.WYPOZYCZONY;
            case "zarezerwowany" -> StatusEgzemplarza.ZAREZERWOWANY;
            case "uszkodzony" -> StatusEgzemplarza.USZKODZONY;
            default -> throw new IllegalArgumentException("Nieznany status: " + dbData);
        };
    }
}
