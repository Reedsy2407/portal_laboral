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
import org.springframework.web.bind.annotation.RestController;

import com.portal_laboral.portal_laboral.entities.NivelExperiencia;
import com.portal_laboral.portal_laboral.service.ExperienciaService;


@RestController
@RequestMapping("/nivel-experiencia")
@CrossOrigin(origins = "http://localhost:4200")
public class ExperienciaController {
    
      @Autowired
    private ExperienciaService service;

    @GetMapping("/listar")
    public List<NivelExperiencia> listar() {
        return service.listar();
    }

    @PostMapping("/guardar")
    public NivelExperiencia guardar(@RequestBody NivelExperiencia nivel) {
        return service.guardar(nivel);
    }

    @GetMapping("/buscar/{id}")
    public NivelExperiencia buscar(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Integer id) {
        service.eliminar(id);
        return ResponseEntity.ok("Nivel de experiencia eliminado");
    }
    
}
