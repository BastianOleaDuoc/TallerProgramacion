<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-Admin-Email");

include_once "C:\\xampp\\htdocs\\mestrax\\backend\\config\\conexion.php";
include_once "C:\\xampp\\htdocs\\mestrax\\backend\\config\\verificar_admin.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once "../config/conexion.php";

if (!isset($_POST['id'])) {
    echo json_encode(["status" => "error", "message" => "ID del producto no proporcionado."]);
    exit;
}

$id = (int)$_POST['id'];

$datos = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("DELETE FROM productos WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["status" => "success", "message" => "Producto eliminado correctamente."]);
    } else {
        echo json_encode(["status" => "error", "message" => "El producto no existe o ya fue eliminado."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Error al eliminar el producto de la base de datos."]);
}

$stmt->close();
$conn->close();
?>