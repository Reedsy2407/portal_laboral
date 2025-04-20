package com.portal_laboral.portal_laboral.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portal_laboral.portal_laboral.entities.Ubicacion;
import com.portal_laboral.portal_laboral.repository.UbicacionRepository;


@Service
public class UbicacionService {

     @Autowired
    private UbicacionRepository repository;

    public List<Ubicacion> listar() {
        return repository.findAll();
    }

    public Ubicacion guardar(Ubicacion ubicacion) {
        return repository.save(ubicacion);
    }

    public Ubicacion buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public void eliminar(Integer id) {
        repository.deleteById(id);
    }
    
}
