package com.portal_laboral.portal_laboral.entities;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer id;

    @Column(name = "nombre_usuario")
    private String nombre;

    @Column(name = "ape_usuario")
    private String apellido;

    @Column(name = "correo_usuario", unique = true, nullable = false)
    private String correo;

    @Column(name = "password_usuario")
    private String password;

    @Column(name = "fecha_registro_usuario")
    private LocalDateTime fecha = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;

    @ManyToOne
    @JoinColumn(name = "id_empresa", nullable = true)
    private Empresa empresa;

    @Embedded
    private Contacto contacto;

    @Column(name = "cv_filename")
    private String cvFilename;

    @Column(name = "cv_content_type")
    private String cvContentType;

    @Lob
    @Column(name = "cv_data", columnDefinition = "LONGBLOB")
    private byte[] cvData;

    public Usuario() { }

    public Usuario (Integer usuarioId) { }

    public String getCvFilename() {
        return cvFilename;
    }

    public void setCvFilename(String cvFilename) {
        this.cvFilename = cvFilename;
    }

    public String getCvContentType() {
        return cvContentType;
    }

    public void setCvContentType(String cvContentType) {
        this.cvContentType = cvContentType;
    }

    public byte[] getCvData() {
        return cvData;
    }

    public void setCvData(byte[] cvData) {
        this.cvData = cvData;
    }

    

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public Integer getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public String getCorreo() {
        return correo;
    }

    public String getPassword() {
        return password;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public Empresa getEmpresa() {
        return empresa;
    }

    public void setEmpresa(Empresa empresa) {
        this.empresa = empresa;
    }

    public Contacto getContacto() {
        return contacto;
    }

    public void setContacto(Contacto contacto) {
        this.contacto = contacto;
    }
}
