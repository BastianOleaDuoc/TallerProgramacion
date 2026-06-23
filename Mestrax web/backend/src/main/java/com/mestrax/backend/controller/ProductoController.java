package com.mestrax.backend.controller;

import com.mestrax.backend.model.Producto;
import com.mestrax.backend.repository.ProductoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class ProductoController {
    private final ProductoRepository productoRepository;

    public ProductoController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public List<Producto> listar() {
        return productoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtener(@PathVariable Long id) {
        return productoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<Producto> toggleEstado(@PathVariable Long id) {
        Producto producto = productoRepository.findById(id).orElse(null);
        if (producto == null) {
            return ResponseEntity.notFound().build();
        }

        producto.setEstado("Disponible".equals(producto.getEstado()) ? "No disponible" : "Disponible");
        return ResponseEntity.ok(productoRepository.save(producto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizar(@PathVariable Long id, @RequestBody Producto cambios) {
        Producto producto = productoRepository.findById(id).orElse(null);
        if (producto == null) {
            return ResponseEntity.notFound().build();
        }

        producto.setNombre(cambios.getNombre());
        producto.setCategoria(cambios.getCategoria());
        producto.setPrecio(cambios.getPrecio());
        producto.setStock(cambios.getStock());
        producto.setEstado(cambios.getEstado() == null || cambios.getEstado().isBlank() ? "Disponible" : cambios.getEstado());

        return ResponseEntity.ok(productoRepository.save(producto));
    }

    @PostMapping
    public Producto crear(@RequestBody Producto producto) {
        if (producto.getEstado() == null || producto.getEstado().isBlank()) {
            producto.setEstado("Disponible");
        }

        return productoRepository.save(producto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!productoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        productoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
