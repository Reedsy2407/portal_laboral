package com.portal_laboral.portal_laboral.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portal_laboral.portal_laboral.entities.Empresa;
import com.portal_laboral.portal_laboral.entities.Ubicacion;
import com.portal_laboral.portal_laboral.repository.EmpresaRepository;

@Service
public class EmpresaService {
    @Autowired
    private EmpresaRepository repository;

    @Autowired
    private UbicacionService ubicacionService;

    public List<Empresa> listar() {
        return repository.findAll();
    }

    public Empresa guardar(Empresa e) {
        if (e.getUbicacion() != null && e.getUbicacion().getId() != null) {
            Ubicacion u = ubicacionService.buscarPorId(e.getUbicacion().getId());
            e.setUbicacion(u);
        }
        return repository.save(e);
    }

    public Empresa buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public void eliminar(Integer id) {
        repository.deleteById(id);
    }
}
