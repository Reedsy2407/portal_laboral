package com.portal_laboral.portal_laboral.service;


import java.util.List;
import java.util.stream.Collectors;

import com.portal_laboral.portal_laboral.entities.Publicacion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portal_laboral.portal_laboral.entities.Postulacion;
import com.portal_laboral.portal_laboral.repository.PostulacionRepository;
@Service
public class PostulacionService{


    @Autowired
    PostulacionRepository repository;

    public List<Postulacion> listar() {
        return repository.findAll();
    }

    public List<Postulacion> listarPorPublicacion(Integer idPublicacion) {
        return repository.findByPublicacionId(idPublicacion);
    }

    public Postulacion guardar(Postulacion postulacion) {
        return repository.save(postulacion);
    }

    public Postulacion buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public void eliminar(Integer id) {
        repository.deleteById(id);
    }

    public List<Publicacion> obtenerPublicacionesPorUsuario(Integer idUsuario) {
        return repository.findByUsuarioId(idUsuario)
                .stream()
                .map(Postulacion::getPublicacion)
                .collect(Collectors.toList());
    }

    public List<Postulacion> obtenerPostulacionesPorUsuario(Integer idUsuario) {
        return repository.findByUsuarioId(idUsuario);
    }

    public void eliminarPorUsuarioYPublicacion(Integer usuarioId, Integer publicacionId) {
        List<Postulacion> postulaciones = repository.findByUsuarioIdAndPublicacion_IdPublicacion(usuarioId, publicacionId);
        for (Postulacion p : postulaciones) {
            repository.delete(p);
        }
    }




}
