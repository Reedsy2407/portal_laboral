package com.portal_laboral.portal_laboral.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.portal_laboral.portal_laboral.entities.TipoContrato;

@Repository
public interface ContratoRepository extends JpaRepository<TipoContrato, Integer>{
    
}
