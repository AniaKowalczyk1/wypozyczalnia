package com.example.wypozyczalnia.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

public enum StatusEgzemplarza {
    DOSTEPNY,
    WYPOZYCZONY,
    ZAREZERWOWANY,
    USZKODZONY
}
