package com.portal_laboral.portal_laboral.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.portal_laboral.portal_laboral.entities.Publicacion;
import com.portal_laboral.portal_laboral.service.PublicacionService;

@RestController
@RequestMapping("/publicacion")
@CrossOrigin(origins = "http://localhost:4200")

public class PublicacionController {
    @Autowired
    private PublicacionService publicacionService;

    @GetMapping("/listar")
    public List<Publicacion> listar() {
        return publicacionService.listar();
    }

    @PostMapping("/guardar")
    public Publicacion guardar(@RequestBody Publicacion publicacion) {
        return publicacionService.guardar(publicacion);
    }

    @GetMapping("/buscar/{id}")
    public Publicacion buscar(@PathVariable Integer id) {
        return publicacionService.buscarPorId(id);
    }

    @DeleteMapping("/eliminarPublicacion/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Integer id) {
        publicacionService.eliminar(id);
        return ResponseEntity.ok("Publicacion eliminada");
    }

}
