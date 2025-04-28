package com.portal_laboral.portal_laboral.repository;

import com.portal_laboral.portal_laboral.entities.Menu;
import com.portal_laboral.portal_laboral.entities.MenuRol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MenuRolRepository extends JpaRepository<MenuRol, Integer> {
    // En tu MenuRolRepository
    @Query("SELECT mr FROM MenuRol mr WHERE mr.rol.id = :idRol")
    List<MenuRol> findMenuRolesByRolId(@Param("idRol") Integer idRol);

}
