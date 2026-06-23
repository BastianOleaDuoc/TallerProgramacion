package com.mestrax.backend.repository;

import com.mestrax.backend.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByFechaAndHoraAndEstadoIn(String fecha, String hora, List<String> estados);

    boolean existsByFechaAndHoraAndMesaAndEstadoIn(String fecha, String hora, Integer mesa, List<String> estados);

    boolean existsByFechaAndHoraAndMesaAndEstadoInAndIdNot(String fecha, String hora, Integer mesa, List<String> estados, Long id);
}
