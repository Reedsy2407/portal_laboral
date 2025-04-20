package com.portal_laboral.portal_laboral.controller;

import com.portal_laboral.portal_laboral.entities.Usuario;
import com.portal_laboral.portal_laboral.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/listar")
    public List<Usuario> listar(){
        return usuarioService.listar();
    }

    @PostMapping("/guardar")
    public Usuario guardar(@RequestBody Usuario usuario){
        return usuarioService.guardar(usuario);
    }

    @GetMapping("/buscar/{id}")
    public Usuario obtener(@PathVariable Integer id){
        return usuarioService.buscarPorId(id);
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Integer id){
        usuarioService.eliminar(id);
        return ResponseEntity.ok("Usuario eliminado");
    }
}
