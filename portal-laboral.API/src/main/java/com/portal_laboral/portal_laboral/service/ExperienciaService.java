package com.portal_laboral.portal_laboral.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portal_laboral.portal_laboral.entities.NivelExperiencia;
import com.portal_laboral.portal_laboral.repository.ExperienciaRepository;

@Service
public class ExperienciaService {
    

     @Autowired
    private ExperienciaRepository repository;

    public List<NivelExperiencia> listar() {
        return repository.findAll();
    }

    public NivelExperiencia guardar(NivelExperiencia nivel) {
        return repository.save(nivel);
    }

    public NivelExperiencia buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public void eliminar(Integer id) {
        repository.deleteById(id);
    }
}
