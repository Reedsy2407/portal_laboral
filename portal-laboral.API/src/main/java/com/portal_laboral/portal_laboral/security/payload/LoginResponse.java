package com.portal_laboral.portal_laboral.security.payload;

import com.portal_laboral.portal_laboral.entities.Rol;

public class LoginResponse {
    private String token;
    private String email;
    private Rol rol;
    private Integer idUsuario;

    public LoginResponse(String token, String email, Rol rol, Integer idUsuario) {
        this.token = token;
        this.idUsuario = idUsuario;
        this.email = email;
        this.rol = rol;
    }

    public String getToken() {
        return token;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }
    public String getEmail() {
        return email;
    }

    public Rol getRol() {
        return rol;
    }
}
