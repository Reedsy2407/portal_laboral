package com.portal_laboral.portal_laboral.security.payload;

public class LoginRequest {

    private String correo;
    private String password;

    // Getters y Setters
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
