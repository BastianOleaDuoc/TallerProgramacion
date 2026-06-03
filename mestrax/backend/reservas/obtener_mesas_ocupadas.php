<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

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

$fecha = isset($_GET['fecha']) ? $_GET['fecha'] : null;
$hora = isset($_GET['hora']) ? $_GET['hora'] : null;

if (!$fecha || !$hora) {
    echo json_encode(["status" => "success", "mesasOcupadas" => []]);
    exit;
}

$inicio_reserva = $fecha . ' ' . $hora . ':00';

$timestamp_inicio = strtotime($inicio_reserva);
$rango_inicio = date("Y-m-d H:i:s", strtotime("-1 hour 59 minutes", $timestamp_inicio));
$rango_fin = date("Y-m-d H:i:s", strtotime("+1 hour 59 minutes", $timestamp_inicio));

try {
    $query = "SELECT mesa FROM reservas 
              WHERE fecha_hora BETWEEN :rango_inicio AND :rango_fin 
              AND estado != 'Cancelada'";
              
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':rango_inicio', $rango_inicio);
    $stmt->bindParam(':rango_fin', $rango_fin);
    $stmt->execute();

    $mesasOcupadas = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $mesasOcupadas[] = (int)$row['mesa'];
    }

    echo json_encode([
        "status" => "success",
        "mesasOcupadas" => array_values(array_unique($mesasOcupadas))
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>