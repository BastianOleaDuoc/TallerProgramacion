package com.mestrax.backend.controller;

import com.mestrax.backend.model.Usuario;
import com.mestrax.backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!usuarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        usuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Usuario nuevoUsuario) {
        if (nuevoUsuario.getEmail() == null || nuevoUsuario.getEmail().isBlank() ||
            nuevoUsuario.getPassword() == null || nuevoUsuario.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email y contraseña son obligatorios."));
        }

        nuevoUsuario.setEmail(nuevoUsuario.getEmail().trim());

   
        if (usuarioRepository.findByEmail(nuevoUsuario.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("success", false, "message", "El correo electrónico ya está registrado."));
        }

        if (nuevoUsuario.getNombre() == null || nuevoUsuario.getNombre().isBlank()) {
            nuevoUsuario.setNombre("Cliente");
        }

        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
            "success", true,
            "message", "Usuario registrado con éxito.",
            "id", usuarioGuardado.getId(),
            "nombre", usuarioGuardado.getNombre(),
            "email", usuarioGuardado.getEmail()
        ));
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Faltan datos."));
        }


        Usuario usuario = usuarioRepository.findByEmail(email.trim()).orElse(null);

        if (usuario == null || !password.equals(usuario.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "Correo o contraseña incorrectos."));
        }

        return ResponseEntity.ok(Map.of(
            "success", true,
            "id", usuario.getId(),
            "nombre", usuario.getNombre(),
            "email", usuario.getEmail()
        ));
    }
}