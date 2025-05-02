package com.portal_laboral.portal_laboral.repository;

import com.portal_laboral.portal_laboral.entities.Postulacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostulacionRepository extends JpaRepository<Postulacion, Integer> {

    List<Postulacion> findByUsuarioId(Integer id);

    @Query("SELECT p FROM Postulacion p WHERE p.publicacion.id = :idPublicacion")
    List<Postulacion> findByPublicacionId(@Param("idPublicacion") Integer idPublicacion);

    List<Postulacion> findByUsuarioIdAndPublicacion_IdPublicacion(Integer usuarioId, Integer idPublicacion);

    // Corregido para usar el nombre de la entidad en lugar del nombre de la tabla
    @Query("SELECT p FROM Postulacion p WHERE p.publicacion.empresa.id = :empresaId")
    List<Postulacion> findByEmpresaId(@Param("empresaId") Integer empresaId);
    
    List<Postulacion> findByPublicacion_IdPublicacion(Integer idPublicacion);
    
    List<Postulacion> findByPublicacion_IdPublicacionOrderByFechaDesc(Integer idPublicacion);
    
    int countByPublicacion_IdPublicacion(Integer idPublicacion);
}