package com.portal_laboral.portal_laboral.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.portal_laboral.portal_laboral.entities.Modalidad;

import java.util.Optional;

@Repository
public interface  ModalidadRepository extends JpaRepository<Modalidad, Integer>{
    Optional<Modalidad> findByModalidad(String modalidad);

}
