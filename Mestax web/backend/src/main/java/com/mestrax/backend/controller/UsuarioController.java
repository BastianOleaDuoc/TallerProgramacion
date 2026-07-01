package com.mestrax.backend.controller;

import com.mestrax.backend.model.Usuario;
import com.mestrax.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping({"/api/usuario", "/api/usuarios"})

@CrossOrigin(
    origins = {"https://nube-mu.vercel.app", "http://localhost:5173"}, 
    allowCredentials = "true", 
    allowedHeaders = "*", 
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;


    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        return usuarioRepository.findByEmail(email)
            .filter(u -> u.getPassword().equals(password))
            .map(u -> {
                u.setPassword(null); 
                return ResponseEntity.ok((Object) u);
            })
            .orElseGet(() -> {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Credenciales incorrectas");
                return ResponseEntity.status(401).body((Object) error);
            });
    }


    @GetMapping("/buscar")
    public ResponseEntity<Object> buscarPorEmail(@RequestParam String email) {
        return usuarioRepository.findByEmail(email)
            .map(u -> {
                u.setPassword(null);
                return ResponseEntity.ok((Object) u);
            })
            .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping("/registro")
    public ResponseEntity<Object> registrar(@RequestBody Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", "Correo ya registrado");
            return ResponseEntity.badRequest().body((Object) error);
        }
        if (usuario.getFechaRegistro() == null) {
            usuario.setFechaRegistro(java.time.LocalDateTime.now());
        }
        return ResponseEntity.ok((Object) usuarioRepository.save(usuario));
    }
}