package com.example.wypozyczalnia.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class StatusRezerwacjiConverter implements AttributeConverter<StatusRezerwacji, String> {

    @Override
    public String convertToDatabaseColumn(StatusRezerwacji status) {
        return switch (status) {
            case AKTYWNA -> "AKTYWNA";
            case ODWOLANA -> "ODWOŁANA";         // polski znak tylko w bazie
            case ZREALIZOWANA -> "ZREALIZOWANA";
            case PRZETERMINOWANA -> "PRZETERMINOWANA";
        };
    }

    @Override
    public StatusRezerwacji convertToEntityAttribute(String dbData) {
        return switch (dbData) {
            case "AKTYWNA" -> StatusRezerwacji.AKTYWNA;
            case "ODWOŁANA" -> StatusRezerwacji.ODWOLANA;
            case "ZREALIZOWANA" -> StatusRezerwacji.ZREALIZOWANA;
            case "PRZETERMINOWANA" -> StatusRezerwacji.PRZETERMINOWANA;
            default -> throw new IllegalArgumentException("Nieznany status rezerwacji: " + dbData);
        };
    }
}
