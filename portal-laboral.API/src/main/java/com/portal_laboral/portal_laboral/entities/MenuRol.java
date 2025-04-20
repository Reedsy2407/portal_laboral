package com.portal_laboral.portal_laboral.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_menu_rol")
public class MenuRol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con Menu
    @ManyToOne
    @JoinColumn(name = "id_menu", nullable = false)
    private Menu menu;

    // Relación con Rol
    @ManyToOne
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Menu getMenu() {
        return menu;
    }

    public void setMenu(Menu menu) {
        this.menu = menu;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }
}
