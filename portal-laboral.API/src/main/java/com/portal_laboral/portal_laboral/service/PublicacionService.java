package com.portal_laboral.portal_laboral.service;

import com.portal_laboral.portal_laboral.entities.Publicacion;
import com.portal_laboral.portal_laboral.repository.PublicacionRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PublicacionService {
    @Autowired
    private PublicacionRepository repository;

    public List<Publicacion> listar() {
        return repository.findAll();
    }

    public Publicacion guardar(Publicacion publicacion) {
        return repository.save(publicacion);
    }

    public Publicacion buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public void eliminar(Integer id) {
        repository.deleteById(id);
    }
}