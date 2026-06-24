<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$ruta_conexion = "C:\\xampp\\htdocs\\mestrax\\backend\\config\\conexion.php";

if (file_exists($ruta_conexion)) {
    include_once $ruta_conexion;
} else {
    echo json_encode(["status" => "error", "message" => "No se encontró conexion.php"]);
    exit;
}


$db = isset($conn) ? $conn : (isset($conexion) ? $conexion : null);

if (!$db) {
    echo json_encode(["status" => "error", "message" => "La variable de conexión no está disponible."]);
    exit;
}

try {

    $queryVentas = "SELECT SUM(total) as ventas_hoy FROM ventas WHERE DATE(fecha_venta) = CURDATE()";
    $resultVentas = $db->query($queryVentas);
    $rowVentas = $resultVentas->fetch_assoc();
    $ventas_hoy = $rowVentas['ventas_hoy'] ? floatval($rowVentas['ventas_hoy']) : 0;

    $queryReservas = "SELECT COUNT(*) as activas FROM reservas WHERE estado != 'Cancelada'";
    $resultReservas = $db->query($queryReservas);
    $rowReservas = $resultReservas->fetch_assoc();
    $reservas_activas = $rowReservas['activas'] ? intval($rowReservas['activas']) : 0;


    $queryProductos = "SELECT COUNT(*) as totales FROM productos";
    $resultProductos = $db->query($queryProductos);
    $rowProductos = $resultProductos->fetch_assoc();
    $productos_totales = $rowProductos['totales'] ? intval($rowProductos['totales']) : 0;


    $producto_estrella = "Cargando...";
    $cantidad_estrella = 0;


    echo json_encode([
        "status" => "success",
        "datos" => [
            "ventas_hoy" => $ventas_hoy,
            "reservas_activas" => $reservas_activas,
            "productos_totales" => $productos_totales,
            "producto_estrella" => $producto_estrella,
            "cantidad_estrella" => $cantidad_estrella
        ]
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Error al compilar métricas: " . $e->getMessage()
    ]);
}
?>