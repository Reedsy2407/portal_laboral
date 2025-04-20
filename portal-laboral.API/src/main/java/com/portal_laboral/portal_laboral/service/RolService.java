package com.portal_laboral.portal_laboral.service;

import com.portal_laboral.portal_laboral.entities.Rol;
import com.portal_laboral.portal_laboral.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolService {
    @Autowired
    private RolRepository repository;

    public List<Rol> listar(){
        return repository.findAll();
    }
}
