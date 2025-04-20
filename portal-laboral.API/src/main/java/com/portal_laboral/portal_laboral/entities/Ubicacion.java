package com.portal_laboral.portal_laboral.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


@Entity
@Table(name="tb_ubicacion")
public class Ubicacion {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id_ubicacion")
    private Integer id;

    @Column(name="nombre_ubicacion", nullable=false)
    private String nombre;

    @Column(name="tipo_ubicacion", nullable=false)
    @Enumerated(EnumType.STRING)
    private TipoUbicacion tipo; // esto es pal departamento, provincia y distrito

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="id_padre")
    private Ubicacion padre; // para que pueda tener otra ubicacion como su ubicacion padre, o sea para filtrar por prov o distritos segun depa
    
    public Ubicacion(){
    }

    public enum TipoUbicacion {
        DEPARTAMENTO,
        PROVINCIA,
        DISTRITO
    }

    public Integer getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public TipoUbicacion getTipo() {
        return tipo;
    }

    public Ubicacion getPadre() {
        return padre;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setTipo(TipoUbicacion tipo) {
        this.tipo = tipo;
    }

    public void setPadre(Ubicacion padre) {
        this.padre = padre;
    }

    

}
