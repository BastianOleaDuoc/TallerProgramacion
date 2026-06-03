<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

// 🚀 RUTA ABSOLUTA CORREGIDA: Apunta directo a la carpeta 'config'
$ruta_conexion = "C:\\xampp\\htdocs\\mestrax\\backend\\config\\conexion.php";

if (file_exists($ruta_conexion)) {
    include_once $ruta_conexion;
} else {
    echo json_encode([
        "status" => "error",
        "message" => "No se encontró conexion.php en la ruta: " . $ruta_conexion
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $mesa           = isset($_POST['mesa']) ? intval($_POST['mesa']) : null;
    $cliente_nombre = isset($_POST['cliente_nombre']) ? trim($_POST['cliente_nombre']) : null;
    $fecha          = isset($_POST['fecha']) ? trim($_POST['fecha']) : null;
    $hora           = isset($_POST['hora']) ? trim($_POST['hora']) : null;
    $personas       = isset($_POST['personas']) ? intval($_POST['personas']) : null;
    $detalles       = isset($_POST['detalles']) ? trim($_POST['detalles']) : '';

    if (!$mesa || !$cliente_nombre || !$fecha || !$hora || !$personas) {
        echo json_encode([
            "status" => "error",
            "message" => "Por favor, completa todos los campos obligatorios."
        ]);
        exit;
    }

    $fecha_hora = $fecha . ' ' . $hora . ':00';

    try {
        $query = "INSERT INTO reservas (mesa, cliente_nombre, fecha_hora, personas, estado, detalles) 
                  VALUES (:mesa, :cliente, :fecha_hora, :personas, 'Pendiente', :detalles)";
                  
        $stmt = $conn->prepare($query);

        $stmt->bindParam(':mesa', $mesa);
        $stmt->bindParam(':cliente', $cliente_nombre);
        $stmt->bindParam(':fecha_hora', $fecha_hora);
        $stmt->bindParam(':personas', $personas);
        $stmt->bindParam(':detalles', $detalles);

        if ($stmt->execute()) {
            echo json_encode([
                "status" => "success",
                "message" => "¡Reserva agendada con éxito! Te esperamos."
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "No se pudo registrar la reserva en este momento."
            ]);
        }

    } catch (PDOException $e) {
        echo json_encode([
            "status" => "error",
            "message" => "Error interno en el servidor: " . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Método no permitido."
    ]);
}
?>