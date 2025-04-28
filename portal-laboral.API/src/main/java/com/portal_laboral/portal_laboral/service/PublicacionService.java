package com.portal_laboral.portal_laboral.service;

import com.portal_laboral.portal_laboral.entities.Modalidad;
import com.portal_laboral.portal_laboral.entities.Publicacion;
import com.portal_laboral.portal_laboral.repository.ModalidadRepository;
import com.portal_laboral.portal_laboral.repository.PublicacionRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PublicacionService {
    @Autowired
    private PublicacionRepository repository;

    @Autowired
    private ModalidadRepository modalidadRepository;

    public List<Publicacion> listar() {
        return repository.findAll();
    }

    public Publicacion crear(Publicacion oferta) {
        // Buscar la modalidad por nombre
        Modalidad modalidad = modalidadRepository.findByModalidad(oferta.getModalidad())
                .orElseThrow(() -> new RuntimeException("Modalidad no encontrada"));

        // Establecer la modalidad encontrada en la oferta
        oferta.setModalidad(modalidad.getModalidad());

        return repository.save(oferta);
    }

    public Publicacion buscarPorId(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public void eliminar(Integer id) {
        repository.deleteById(id);
    }
}