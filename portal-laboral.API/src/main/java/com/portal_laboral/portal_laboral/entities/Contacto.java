package com.portal_laboral.portal_laboral.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

    @Embeddable
    public class Contacto {
        
        @Column(name="telefono_contacto", length=20) 
        private String telefono;
        
        @Column(name="sitioweb_contacto", length=100)
        private String sitioWeb;

        @Column(name="linkedin_contacto", length=100)
        private String linkedin;

        public Contacto(){
            
        }

        public String getTelefono() {
            return telefono;
        }

        public String getSitioWeb() {
            return sitioWeb;
        }

        public String getLinkedin() {
            return linkedin;
        }

        public void setTelefono(String telefono) {
            this.telefono = telefono;
        }

        public void setSitioWeb(String sitioWeb) {
            this.sitioWeb = sitioWeb;
        }

        public void setLinkedin(String linkedin) {
            this.linkedin = linkedin;
        }


    }
