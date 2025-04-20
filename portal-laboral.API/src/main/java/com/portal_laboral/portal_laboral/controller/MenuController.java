package com.portal_laboral.portal_laboral.controller;

import com.portal_laboral.portal_laboral.entities.Menu;
import com.portal_laboral.portal_laboral.entities.Rol;
import com.portal_laboral.portal_laboral.entities.Usuario;
import com.portal_laboral.portal_laboral.repository.UsuarioRepository;
import com.portal_laboral.portal_laboral.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/menu")

public class MenuController {
    @Autowired
    private MenuService service;
    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/listarMenu/{idUsuario}")
    public List<Menu> obtenerMenusPorUsuario(@PathVariable Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow();
        Rol rol = usuario.getRol();
        return service.listarMenuPorRol(rol.getId());
    }
}
