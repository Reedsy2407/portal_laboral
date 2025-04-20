package com.portal_laboral.portal_laboral.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portal_laboral.portal_laboral.entities.TipoJornada;
import com.portal_laboral.portal_laboral.repository.JornadaRepository;


@Service
public class JornadaService {


      @Autowired
    private JornadaRepository repository;

    public List<TipoJornada> listar() {
        return repository.findAll();
    }

    public TipoJornada guardar(TipoJornada jornada) {
        return repository.save(jornada);
    }

    public TipoJornada buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public void eliminar(Integer id) {
        repository.deleteById(id);
    }
}
