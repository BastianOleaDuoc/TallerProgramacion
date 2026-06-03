<?php
// Permitir peticiones desde el frontend
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");


include_once "../conexion.php"; 

try {
    // Consulta SQL para traer todas las reservas ordenadas por la fecha más cercana primero
    $query = "SELECT id, mesa, cliente_nombre, fecha_hora, personas, estado, detalles FROM reservas ORDER BY fecha_hora ASC";
    $stmt = $conn->prepare($query);
    $stmt->execute();

    $reservas = [];

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

        $fechaFormateada = date("Y-m-d, H:i", strtotime($row['fecha_hora']));

        $reserva_item = [
            "id" => (int)$row['id'],
            "mesa" => (int)$row['mesa'],
            "cliente" => $row['cliente_nombre'],
            "fecha_hora" => $fechaFormateada,
            "personas" => (int)$row['personas'],
            "estado" => $row['estado'],
            "detalles" => $row['detalles'] ? $row['detalles'] : "Sin observaciones"
        ];
        array_push($reservas, $reserva_item);
    }

    // Respuesta exitosa
    echo json_encode([
        "status" => "success",
        "data" => $reservas
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "status" => "error",
        "message" => "Error al obtener las reservas: " . $e->getMessage()
    ]);
}
?>