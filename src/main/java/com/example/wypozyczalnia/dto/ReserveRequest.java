package com.example.wypozyczalnia.dto;

import java.util.List;

public class ReserveRequest {

    private Long idKonta;
    private Long idFilii;
    private List<Long> egzemplarzeId;

    // ===== Gettery i Settery =====
    public Long getIdKonta() {
        return idKonta;
    }

    public void setIdKonta(Long idKonta) {
        this.idKonta = idKonta;
    }

    public Long getIdFilii() {
        return idFilii;
    }

    public void setIdFilii(Long idFilii) {
        this.idFilii = idFilii;
    }

    public List<Long> getEgzemplarzeId() {
        return egzemplarzeId;
    }

    public void setEgzemplarzeId(List<Long> egzemplarzeId) {
        this.egzemplarzeId = egzemplarzeId;
    }
}
