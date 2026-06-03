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


$email = isset($_GET['email']) ? trim($_GET['email']) : null;

try {

    $conn->exec("CREATE TABLE IF NOT EXISTS ventas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_email VARCHAR(100) NOT NULL,
        fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP,
        total DECIMAL(10, 2) NOT NULL,
        metodo_pago VARCHAR(50) NOT NULL,
        estado VARCHAR(50) DEFAULT 'Completado',
        detalles_productos TEXT NOT NULL
    )");

    if ($email) {

        $query = "SELECT id AS id_venta, fecha_venta AS fecha_hora, total, metodo_pago, estado, detalles_productos 
                  FROM ventas 
                  WHERE usuario_email = :email 
                  ORDER BY fecha_venta DESC";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':email', $email);
    } else {

        $query = "SELECT id AS id_venta, fecha_venta AS fecha_hora, total, metodo_pago, estado, detalles_productos 
                  FROM ventas 
                  ORDER BY fecha_venta DESC";
        $stmt = $conn->prepare($query);
    }
    
    $stmt->execute();
    $ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);


    echo json_encode([
        "status" => "success",
        "data" => $ventas
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Error en la base de datos: " . $e->getMessage()
    ]);
}
?>