package com.portal_laboral.portal_laboral.entities;

import jakarta.persistence.*;

import java.util.List;


@Entity
@Table(name = "tb_empresa")
public class Empresa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_empresa")
    private Integer id;

    @Column(name = "nombre_empresa")
    private String nombre;

    @Column(name = "ruc_empresa")
    private String ruc;

    @Column(name = "correo_empresa", unique = true)
    private String correo;

    @Column(name = "direccion_empresa", unique = true)
    private String direccion;

    @Column(name = "desc_empresa")
    private String descripcion;

    @Embedded
    private Contacto contacto;


    @OneToMany(mappedBy = "empresa")
    private List<Usuario> usuarios;

    public Empresa() { }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getRuc() {
        return ruc;
    }

    public void setRuc(String ruc) {
        this.ruc = ruc;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Contacto getContacto() {
        return contacto;
    }
    public void setContacto(Contacto contacto) {
        this.contacto = contacto;
    }

}
