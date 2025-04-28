package com.portal_laboral.portal_laboral.service;

import com.portal_laboral.portal_laboral.entities.MenuRol;
import com.portal_laboral.portal_laboral.repository.MenuRolRepository;
import com.portal_laboral.portal_laboral.entities.Menu;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuService {
    @Autowired
    private MenuRolRepository repository;

    public List<Menu> listarMenuPorRol(Integer idRol){
        List<MenuRol> menuRoles = repository.findMenuRolesByRolId(idRol);
        for (MenuRol mr : menuRoles) {
            System.out.println("Menu: " + mr.getMenu().getNombre());
        }
        return menuRoles.stream()
                .map(MenuRol::getMenu)
                .toList();
    }

}
