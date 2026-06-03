<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$ruta_conexion = "C:\\xampp\\htdocs\\mestrax\\backend\\config\\conexion.php";

if (file_exists($ruta_conexion)) {
    include_once $ruta_conexion;
} else {
    echo json_encode(["status" => "error", "message" => "No se encontró conexion.php"]);
    exit;
}

$datosRecibidos = json_decode(file_get_contents("php://input"), true);

if (!isset($datosRecibidos['total']) || !isset($datosRecibidos['productos'])) {
    echo json_encode(["status" => "error", "message" => "Datos incompletos para registrar la venta."]);
    exit;
}

$total = $datosRecibidos['total'];
$productos = $datosRecibidos['productos'];


$usuario_email = isset($datosRecibidos['email']) ? trim($datosRecibidos['email']) : 'invitado@mestrax.com';
$metodo_pago = isset($datosRecibidos['metodo_pago']) ? trim($datosRecibidos['metodo_pago']) : 'Efectivo/Transferencia';


$detalles_productos = json_encode($productos, JSON_UNESCAPED_UNICODE);

try {
    $query = "INSERT INTO ventas (usuario_email, total, metodo_pago, detalles_productos, fecha_venta) 
              VALUES (:email, :total, :metodo, :detalles, NOW())";
              
    $stmt = $conn->prepare($query);
    
    $stmt->execute([
        ':email' => $usuario_email,
        ':total' => $total,
        ':metodo' => $metodo_pago,
        ':detalles' => $detalles_productos
    ]);
    
    echo json_encode([
        "status" => "success",
        "message" => "Venta registrada con éxito.",
        "id_venta" => $conn->lastInsertId()
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Fallo al guardar la venta: " . $e->getMessage()
    ]);
}
?>