package com.portal_laboral.portal_laboral.controller;

import com.portal_laboral.portal_laboral.entities.Rol;
import com.portal_laboral.portal_laboral.service.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/rol")
public class RolController {
    @Autowired
    private RolService service;

    @GetMapping("/listar")
    public List<Rol> listar (){
        return service.listar();
    }
}
