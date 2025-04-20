package com.portal_laboral.portal_laboral.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;



@Entity
@Table(name="tb_tipo_contrato")
public class TipoContrato {
    //Esto es un combobox pal filtrado pe
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id_tipo_contrato")
    private Integer id;

    @Column(name="desc_contrato", nullable=false)
    private String descripcion;

    public TipoContrato(){

    }

    public Integer getId() {
        return id;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }



    
}
