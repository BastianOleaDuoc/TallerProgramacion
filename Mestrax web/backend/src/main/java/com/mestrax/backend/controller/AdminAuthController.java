package com.mestrax.backend.controller;

import com.mestrax.backend.model.Admin;
import com.mestrax.backend.repository.AdminRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class AdminAuthController {
    private final AdminRepository adminRepository;

    public AdminAuthController(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Faltan datos"));
        }

        Admin admin = adminRepository.findByEmail(email.trim()).orElse(null);

        if (admin == null || !password.equals(admin.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Credenciales incorrectas"));
        }

        return ResponseEntity.ok(Map.of("success", true, "email", admin.getEmail()));
    }
}
