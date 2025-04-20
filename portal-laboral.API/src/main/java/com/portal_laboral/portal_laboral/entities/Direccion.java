package com.portal_laboral.portal_laboral.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class Direccion {
        @Column(name="calle_direccion", length=100) 
        private String calle;

        @Column(name="numero_direccion", length=10)
        private String numero;

        @Column(name="distrito_direccion", length=50)
        private String distrito;

        @Column(name="codpos_direccion", length=10)
        private String codigoPostal;

        public Direccion(){
            
        }

    public String getCalle() {
        return calle;
    }

    public String getNumero() {
        return numero;
    }

    public String getDistrito() {
        return distrito;
    }

    public String getCodigoPostal() {
        return codigoPostal;
    }

    public void setCalle(String calle) {
        this.calle = calle;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public void setDistrito(String distrito) {
        this.distrito = distrito;
    }

    public void setCodigoPostal(String codigoPostal) {
        this.codigoPostal = codigoPostal;
    }



}
