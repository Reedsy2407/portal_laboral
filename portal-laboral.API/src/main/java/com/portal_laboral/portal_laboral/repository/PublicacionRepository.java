package com.portal_laboral.portal_laboral.repository;

import java.util.List;
import java.util.Optional;

import com.portal_laboral.portal_laboral.entities.Modalidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.portal_laboral.portal_laboral.entities.Publicacion;
import org.springframework.web.bind.annotation.CrossOrigin;

@Repository
@CrossOrigin(origins = "http://localhost:4200")
public interface PublicacionRepository extends JpaRepository<Publicacion, Integer> {

    @Procedure(name = "Publicacion.filtrarPublicaciones")
    List<Publicacion> filtrarPublicaciones(
    @Param("p_minSueldo") Double minSueldo,
    @Param("p_dias") Integer dias,
    @Param("p_idUbicacion") Integer idUbicacion,
    @Param("p_idCategoria") Integer idCategoria,
    @Param("p_idModalidad") Integer idModalidad,
    @Param("p_idNivelExperiencia") Integer idNivelExp,
    @Param("p_idTipoContrato") Integer idTipoContrato,
     @Param("p_idTipoJornada") Integer idTipoJornada
    );
}
