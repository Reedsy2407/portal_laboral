package com.portal_laboral.portal_laboral.repository;

import com.portal_laboral.portal_laboral.entities.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa, Integer> {
    List<Empresa> findByNombreContainingIgnoreCase(String nombre);
}
