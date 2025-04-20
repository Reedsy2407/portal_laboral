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

import com.portal_laboral.portal_laboral.entities.TipoJornada;
import com.portal_laboral.portal_laboral.service.JornadaService;


@RestController
@RequestMapping("/tipo-jornada")
@CrossOrigin(origins = "http://localhost:4200")
public class JornadaController {

      @Autowired
    private JornadaService service;

    @GetMapping("/listar")
    public List<TipoJornada> listar() {
        return service.listar();
    }

    @PostMapping("/guardar")
    public TipoJornada guardar(@RequestBody TipoJornada jornada) {
        return service.guardar(jornada);
    }

    @GetMapping("/buscar/{id}")
    public TipoJornada buscar(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Integer id) {
        service.eliminar(id);
        return ResponseEntity.ok("Tipo de jornada eliminado");
    }
    
}
