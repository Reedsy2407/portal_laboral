package com.portal_laboral.portal_laboral.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portal_laboral.portal_laboral.entities.Modalidad;
import com.portal_laboral.portal_laboral.repository.ModalidadRepository;


@Service
public class ModalidadService {
    @Autowired
    private ModalidadRepository repository;

    public List<Modalidad> listar() {
        return repository.findAll();
    }

    public Modalidad guardar(Modalidad modalidad) {
        return repository.save(modalidad);
    }

    public Modalidad buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public void eliminar(Integer id) {
        repository.deleteById(id);
    }
}
