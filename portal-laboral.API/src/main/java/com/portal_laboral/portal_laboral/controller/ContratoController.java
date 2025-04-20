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

import com.portal_laboral.portal_laboral.entities.TipoContrato;
import com.portal_laboral.portal_laboral.service.ContratoService;


@RestController
@RequestMapping("/tipo-contrato")
@CrossOrigin(origins = "http://localhost:4200")
public class ContratoController {

    @Autowired
    private ContratoService service;

    @GetMapping("/listar")
    public List<TipoContrato> listar() {
        return service.listar();
    }

    @PostMapping("/guardar")
    public TipoContrato guardar(@RequestBody TipoContrato contrato) {
        return service.guardar(contrato);
    }

    @GetMapping("/buscar/{id}")
    public TipoContrato buscar(@PathVariable Integer id) {
        return service.buscarPorId(id);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Integer id) {
        service.eliminar(id);
        return ResponseEntity.ok("Tipo de contrato eliminado");
    }
    
}
