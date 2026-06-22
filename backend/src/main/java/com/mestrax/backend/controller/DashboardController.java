package com.mestrax.backend.controller;

import com.mestrax.backend.repository.ProductoRepository;
import com.mestrax.backend.repository.ReservaRepository;
import com.mestrax.backend.repository.VentaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class DashboardController {
    private final ProductoRepository productoRepository;
    private final ReservaRepository reservaRepository;
    private final VentaRepository ventaRepository;

    public DashboardController(ProductoRepository productoRepository, ReservaRepository reservaRepository, VentaRepository ventaRepository) {
        this.productoRepository = productoRepository;
        this.reservaRepository = reservaRepository;
        this.ventaRepository = ventaRepository;
    }

    @GetMapping
    public Map<String, Object> datos() {
        long productosActivos = productoRepository.findAll().stream()
                .filter(p -> "Disponible".equals(p.getEstado()))
                .count();

        long reservasHoy = reservaRepository.findAll().stream()
                .filter(r -> "Confirmada".equals(r.getEstado()))
                .count();

        double totalVentas = ventaRepository.findAll().stream()
                .filter(v -> !"Anulada".equals(v.getEstado()))
                .mapToDouble(v -> v.getTotal())
                .sum();

        return Map.of(
                "productosActivos", productosActivos,
                "reservasHoy", reservasHoy,
                "totalVentas", totalVentas
        );
    }
}
