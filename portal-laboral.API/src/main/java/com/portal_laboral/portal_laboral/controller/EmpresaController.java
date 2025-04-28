package com.portal_laboral.portal_laboral.controller;

import com.portal_laboral.portal_laboral.entities.Empresa;
import com.portal_laboral.portal_laboral.repository.EmpresaRepository;
import com.portal_laboral.portal_laboral.service.EmpresaService;
import com.portal_laboral.portal_laboral.service.PublicacionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/empresa")
public class EmpresaController{

    @Autowired
    private EmpresaService empresaService;

    @GetMapping("/listar")
    public List<Empresa> listar(){
        return empresaService.listar();
    }

    @PostMapping("/guardar")
    public Empresa guardarEmpresa(@RequestBody Empresa empresa){
        return empresaService.guardar(empresa);
    }

    @GetMapping("/buscarPorNombre/{nombre}")
    public List<Empresa> buscarEmpresas(@PathVariable String nombre) {
        return empresaService.buscarPorNombre(nombre);
    }

    @GetMapping("/buscar/{id}")
    public Empresa buscarEmpresa(@PathVariable Integer id){
        return empresaService.buscarPorId(id);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Integer id){
        empresaService.eliminar(id);
        return ResponseEntity.ok("Empresa Eliminada");

    }
}
