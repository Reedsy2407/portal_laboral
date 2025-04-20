package com.portal_laboral.portal_laboral.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portal_laboral.portal_laboral.entities.TipoContrato;
import com.portal_laboral.portal_laboral.repository.ContratoRepository;

@Service
public class ContratoService {


      @Autowired
    private ContratoRepository repository;

    public List<TipoContrato> listar() {
        return repository.findAll();
    }

    public TipoContrato guardar(TipoContrato contrato) {
        return repository.save(contrato);
    }

    public TipoContrato buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public void eliminar(Integer id) {
        repository.deleteById(id);
    }
}
