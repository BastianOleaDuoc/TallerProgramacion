package com.mestrax.backend.controller;

import com.mestrax.backend.model.Reserva;
import com.mestrax.backend.repository.ReservaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class ReservaController {
    private static final List<String> ESTADOS_BLOQUEANTES = List.of("Pendiente", "Confirmada");

    private final ReservaRepository reservaRepository;

    public ReservaController(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    @GetMapping
    public List<Reserva> listar() {
        return reservaRepository.findAll();
    }

    @GetMapping("/ocupadas")
    public List<Reserva> listarOcupadas(@RequestParam String fecha, @RequestParam String hora) {
        return reservaRepository.findByFechaAndHoraAndEstadoIn(fecha, hora, ESTADOS_BLOQUEANTES);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reserva> obtener(@PathVariable Long id) {
        return reservaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Reserva reserva) {
        reserva.setEstado(normalizarEstado(reserva.getEstado()));

        if (bloqueaHorario(reserva) && reservaRepository.existsByFechaAndHoraAndMesaAndEstadoIn(
                reserva.getFecha(),
                reserva.getHora(),
                reserva.getMesa(),
                ESTADOS_BLOQUEANTES
        )) {
            return conflictoMesa();
        }

        return ResponseEntity.ok(reservaRepository.save(reserva));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Reserva cambios) {
        Reserva reserva = reservaRepository.findById(id).orElse(null);
        if (reserva == null) {
            return ResponseEntity.notFound().build();
        }

        cambios.setEstado(normalizarEstado(cambios.getEstado()));
        if (bloqueaHorario(cambios) && reservaRepository.existsByFechaAndHoraAndMesaAndEstadoInAndIdNot(
                cambios.getFecha(),
                cambios.getHora(),
                cambios.getMesa(),
                ESTADOS_BLOQUEANTES,
                id
        )) {
            return conflictoMesa();
        }

        reserva.setCliente(cambios.getCliente());
        reserva.setTelefono(cambios.getTelefono());
        reserva.setEmail(cambios.getEmail());
        reserva.setFecha(cambios.getFecha());
        reserva.setHora(cambios.getHora());
        reserva.setPersonas(cambios.getPersonas());
        reserva.setMesa(cambios.getMesa());
        reserva.setComentarios(cambios.getComentarios());
        reserva.setEstado(cambios.getEstado());

        return ResponseEntity.ok(reservaRepository.save(reserva));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Reserva reserva = reservaRepository.findById(id).orElse(null);
        if (reserva == null) {
            return ResponseEntity.notFound().build();
        }

        String estado = body.get("estado");
        if (estado != null) {
            String estadoNormalizado = normalizarEstado(estado);
            reserva.setEstado(estadoNormalizado);

            if (bloqueaHorario(reserva) && reservaRepository.existsByFechaAndHoraAndMesaAndEstadoInAndIdNot(
                    reserva.getFecha(),
                    reserva.getHora(),
                    reserva.getMesa(),
                    ESTADOS_BLOQUEANTES,
                    id
            )) {
                return conflictoMesa();
            }
        }

        return ResponseEntity.ok(reservaRepository.save(reserva));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!reservaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        reservaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private String normalizarEstado(String estado) {
        return estado == null || estado.isBlank() ? "Pendiente" : estado;
    }

    private boolean bloqueaHorario(Reserva reserva) {
        return reserva.getMesa() != null
                && reserva.getFecha() != null
                && !reserva.getFecha().isBlank()
                && reserva.getHora() != null
                && !reserva.getHora().isBlank()
                && ESTADOS_BLOQUEANTES.contains(reserva.getEstado());
    }

    private ResponseEntity<Map<String, String>> conflictoMesa() {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "La mesa ya esta reservada para ese horario."));
    }
}
