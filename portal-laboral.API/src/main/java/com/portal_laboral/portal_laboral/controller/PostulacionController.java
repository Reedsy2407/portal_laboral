package com.portal_laboral.portal_laboral.controller;

import com.portal_laboral.portal_laboral.entities.Postulacion;
import com.portal_laboral.portal_laboral.entities.Publicacion;
import com.portal_laboral.portal_laboral.entities.Usuario;
import com.portal_laboral.portal_laboral.repository.PostulacionRepository;
import com.portal_laboral.portal_laboral.repository.PublicacionRepository;
import com.portal_laboral.portal_laboral.repository.UsuarioRepository;
import com.portal_laboral.portal_laboral.service.PostulacionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/postulacion")
public class PostulacionController {

    @Autowired
    private PostulacionService postulacionService;


    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PublicacionRepository publicacionRepository;

    @Autowired
    private PostulacionRepository postulacionRepository;


    public PostulacionController(PostulacionService postulacionService){
        this.postulacionService=postulacionService;
    }

    @GetMapping("/listar")
    public List<Postulacion> listaPostulacion(){

        return postulacionService.listar();
    }

    @GetMapping("/por-publicacion/{idPublicacion}")
    public ResponseEntity<List<Postulacion>> obtenerPorPublicacion(
            @PathVariable Integer idPublicacion) {
        List<Postulacion> postulaciones = postulacionService.listarPorPublicacion(idPublicacion);
        return ResponseEntity.ok(postulaciones);
    }

    @PostMapping("/guardar")
    public Postulacion guardar(@RequestBody Postulacion postulacion){
        return postulacionService.guardar(postulacion);
    }

    @GetMapping("/buscar/{id}")
    public Postulacion obtenerId(@PathVariable Integer id){
        return postulacionService.buscarPorId(id);
    }


    @GetMapping("/mis-postulaciones/{idUsuario}")
    public List<Publicacion> obtenerPostulacionesPorUsuario(@PathVariable Integer idUsuario) {
        return postulacionService.obtenerPublicacionesPorUsuario(idUsuario);
    }

    @PutMapping("/cambiar-estado/{id}")
    public ResponseEntity<?> cambiarEstadoPostulacion(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        try {
            Postulacion postulacion = postulacionService.buscarPorId(id);
            if (postulacion == null) {
                return ResponseEntity.notFound().build();
            }

            Postulacion.EstadoPostulacion nuevoEstado =
                    Postulacion.EstadoPostulacion.valueOf(request.get("estado"));
            postulacion.setEstado(nuevoEstado);
            postulacionService.guardar(postulacion);

            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Estado no válido");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/crear")
    public ResponseEntity<String> crearPostulacion(@RequestBody Map<String, Integer> body) {
        Integer usuarioId = body.get("usuarioId");
        Integer publicacionId = body.get("publicacionId");

        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);
        Publicacion publicacion = publicacionRepository.findById(publicacionId).orElse(null);

        if (usuario == null || publicacion == null) {
            return ResponseEntity.badRequest().body("Usuario o publicación no encontrados");
        }

        Postulacion postulacion = new Postulacion();
        postulacion.setUsuario(usuario);
        postulacion.setPublicacion(publicacion);
        postulacion.setFecha(LocalDateTime.now());

        postulacionService.guardar(postulacion);
        return ResponseEntity.ok("Postulación creada");
    }

    @DeleteMapping("/eliminar")
    public ResponseEntity<Map<String, String>> eliminarPorUsuarioYPublicacion(
            @RequestParam Integer usuarioId,
            @RequestParam Integer publicacionId) {

        postulacionService.eliminarPorUsuarioYPublicacion(usuarioId, publicacionId);
        return ResponseEntity.ok(Map.of("mensaje","postulacion eliminada"));
    }


}
