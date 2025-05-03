package com.portal_laboral.portal_laboral.controller;

import com.portal_laboral.portal_laboral.entities.Usuario;
import com.portal_laboral.portal_laboral.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    public Usuario guardar(@RequestBody Usuario usuario) {
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

    @PostMapping("/{id}/upload-cv")
    public ResponseEntity<String> uploadCv(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file) {
        try {
            Usuario usuario = usuarioService.buscarPorId(id);
            if (usuario == null) {
                return ResponseEntity.notFound().build();
            }

            usuario.setCvFilename(file.getOriginalFilename());
            usuario.setCvContentType(file.getContentType());
            usuario.setCvData(file.getBytes());

            usuarioService.guardar(usuario);

            return ResponseEntity.ok("CV subido exitosamente");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error al subir el CV");
        }
    }

    @GetMapping("/{id}/download-cv")
    public ResponseEntity<byte[]> downloadCv(@PathVariable Integer id) {
        Usuario usuario = usuarioService.buscarPorId(id);
        if (usuario == null || usuario.getCvData() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(usuario.getCvContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + usuario.getCvFilename() + "\"")
                .body(usuario.getCvData());
    }
}
