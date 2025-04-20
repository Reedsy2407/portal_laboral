package com.portal_laboral.portal_laboral.repository;

import com.portal_laboral.portal_laboral.entities.Postulacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostulacionRepository extends JpaRepository<Postulacion, Integer> {

    List<Postulacion> findByUsuarioId(Integer id);

    List<Postulacion> findByUsuarioIdAndPublicacion_IdPublicacion(Integer usuarioId, Integer idPublicacion);





}
