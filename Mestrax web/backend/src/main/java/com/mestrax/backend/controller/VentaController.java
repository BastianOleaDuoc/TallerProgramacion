package com.mestrax.backend.controller;

import com.mestrax.backend.model.Venta;
import com.mestrax.backend.repository.VentaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class VentaController {
    private final VentaRepository ventaRepository;

    public VentaController(VentaRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
    }

    @GetMapping
    public List<Venta> listar() {
        return ventaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venta> obtener(@PathVariable Long id) {
        return ventaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Venta> crear(@RequestBody Venta venta) {
        if (venta.getEstado() == null || venta.getEstado().isBlank()) {
            venta.setEstado("Pagada");
        }

        return ResponseEntity.ok(ventaRepository.save(venta));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Venta> actualizar(@PathVariable Long id, @RequestBody Venta cambios) {
        Venta venta = ventaRepository.findById(id).orElse(null);
        if (venta == null) {
            return ResponseEntity.notFound().build();
        }

        venta.setCliente(cambios.getCliente());
        venta.setProducto(cambios.getProducto());
        venta.setTotal(cambios.getTotal());
        venta.setMetodo(cambios.getMetodo());
        venta.setEstado(cambios.getEstado() == null || cambios.getEstado().isBlank() ? "Pagada" : cambios.getEstado());

        return ResponseEntity.ok(ventaRepository.save(venta));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Venta> actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Venta venta = ventaRepository.findById(id).orElse(null);
        if (venta == null) {
            return ResponseEntity.notFound().build();
        }

        String estado = body.get("estado");
        if (estado != null && !estado.isBlank()) {
            venta.setEstado(estado);
        }

        return ResponseEntity.ok(ventaRepository.save(venta));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!ventaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        ventaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
