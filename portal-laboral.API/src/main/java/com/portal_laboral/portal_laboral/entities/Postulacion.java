package com.portal_laboral.portal_laboral.entities;

import jakarta.persistence.*;


import java.time.LocalDateTime;

@Entity
@Table(name = "tb_postulacion")
public class Postulacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_postulacion")
    private Integer id;

    public enum EstadoPostulacion {
        POSTULADO,
        EN_REVISION,
        SELECCIONADO,
        DESCARTADO,
        FINALIZADO
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoPostulacion estado = EstadoPostulacion.POSTULADO;

    @Column(name = "fecha_postulacion")
    private LocalDateTime fecha = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_publicacion")
    private Publicacion publicacion;

    public Postulacion() { }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public EstadoPostulacion getEstado() {
        return estado;
    }

    public void setEstado(EstadoPostulacion estado) {
        this.estado = estado;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Publicacion getPublicacion() {
        return publicacion;
    }

    public void setPublicacion(Publicacion publicacion) {
        this.publicacion = publicacion;
    }



}
