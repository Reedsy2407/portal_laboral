package com.portal_laboral.portal_laboral.security;

import com.portal_laboral.portal_laboral.entities.Rol;
import com.portal_laboral.portal_laboral.entities.Usuario;
import com.portal_laboral.portal_laboral.repository.RolRepository;
import com.portal_laboral.portal_laboral.repository.UsuarioRepository;
import com.portal_laboral.portal_laboral.security.payload.LoginRequest;
import com.portal_laboral.portal_laboral.security.payload.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AuthController {

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getPassword()));

        String token = jwtUtil.generateToken(auth.getName());

        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo()).orElseThrow();

        return ResponseEntity.ok(new LoginResponse(token, usuario.getCorreo(), usuario.getRol(), usuario.getId()));
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario usuario) {
        if (usuarioRepository.findByCorreo(usuario.getCorreo()).isPresent()) {
            return ResponseEntity.badRequest().body("El correo ya está registrado");
        }

        if (usuario.getRol() == null) {
            return ResponseEntity.badRequest().body("El rol es obligatorio");
        }

        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Usuario registrado con éxito");
    }


}
