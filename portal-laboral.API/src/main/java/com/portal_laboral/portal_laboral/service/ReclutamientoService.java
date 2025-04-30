package com.portal_laboral.portal_laboral.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portal_laboral.portal_laboral.entities.Postulacion;
import com.portal_laboral.portal_laboral.entities.Publicacion;
import com.portal_laboral.portal_laboral.repository.EmpresaRepository;
import com.portal_laboral.portal_laboral.repository.PostulacionRepository;
import com.portal_laboral.portal_laboral.repository.PublicacionRepository;

@Service
public class ReclutamientoService {
    
    @Autowired
    private PostulacionRepository postulacionRepository;
    
    @Autowired
    private EmpresaRepository empresaRepository;
    
    @Autowired
    private PublicacionRepository publicacionRepository;
    
    // Obtener todas las postulaciones para una empresa
    public List<Postulacion> obtenerPostulacionesPorEmpresa(Integer empresaId) {
        return postulacionRepository.findByEmpresaId(empresaId);
    }
    
    // Obtener postulaciones por publicación específica
    public List<Postulacion> obtenerPostulacionesPorPublicacion(Integer publicacionId) {
        return postulacionRepository.findByPublicacion_IdPublicacionOrderByFechaDesc(publicacionId);
    }
    
    // Obtener estadísticas de postulaciones por empresa
    public Map<String, Object> obtenerEstadisticasPostulaciones(Integer empresaId) {
        List<Publicacion> publicaciones = publicacionRepository.findByEmpresaId(empresaId);
        Map<String, Object> estadisticas = new HashMap<>();
        
        int totalPostulaciones = 0;
        Map<String, Integer> postulacionesPorPublicacion = new HashMap<>();
        
        for (Publicacion publicacion : publicaciones) {
            int count = postulacionRepository.countByPublicacion_IdPublicacion(publicacion.getIdPublicacion());
            postulacionesPorPublicacion.put(publicacion.getTitulo(), count);
            totalPostulaciones += count;
        }
        
        estadisticas.put("totalPostulaciones", totalPostulaciones);
        estadisticas.put("postulacionesPorPublicacion", postulacionesPorPublicacion);
        
        return estadisticas;
    }
}