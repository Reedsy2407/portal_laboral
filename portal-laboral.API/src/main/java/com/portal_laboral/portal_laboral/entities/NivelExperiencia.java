package com.portal_laboral.portal_laboral.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="tb_nivel_experiencia")
public class NivelExperiencia {

    //Esto es un combobox pal filtrado pe
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_nivel_experiencia")
    private Integer id;

    @Column(name="experiencia", nullable=false)
    private String experiencia; 

    public NivelExperiencia() {}

    public Integer getId() {
        return id;
    }

    public String getExperiencia() {
        return experiencia;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setExperiencia(String experiencia) {
        this.experiencia = experiencia;
    }


    
}
