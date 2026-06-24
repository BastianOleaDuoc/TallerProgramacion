<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/conexion.php";

// Validamos campos obligatorios
if (empty($_POST['nombre']) || empty($_POST['categoria']) || empty($_POST['precio'])) {
    echo json_encode(["status" => "error", "message" => "Faltan campos obligatorios (nombre, categoria o precio)."]);
    exit;
}

$nombre = trim($_POST['nombre']);
$categoria = trim($_POST['categoria']);
$precio = (int)$_POST['precio'];
$descripcion = isset($_POST['descripcion']) ? trim($_POST['descripcion']) : "";
$stock = isset($_POST['stock']) ? (int)$_POST['stock'] : 20;

// Manejo de la Imagen
$nombre_imagen = "default.png";

if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['imagen']['tmp_name'];
    $fileName = $_FILES['imagen']['name'];
    
    $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $nuevo_nombre_img = time() . "_" . preg_replace("/[^a-zA-Z0-9]/", "", $nombre) . "." . $fileExtension;
    $uploadFileDir = '../../frontend/img/';
    

    if (!is_dir($uploadFileDir)) {
        mkdir($uploadFileDir, 0777, true);
    }
    
    $dest_path = $uploadFileDir . $nuevo_nombre_img;
    
    if(move_uploaded_file($fileTmpPath, $dest_path)) {
        $nombre_imagen = $nuevo_nombre_img;
    }
}

// Insertar en la Base de Datos
$stmt = $conn->prepare("INSERT INTO productos (nombre, categoria, precio, imagen, descripcion, stock) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssissi", $nombre, $categoria, $precio, $nombre_imagen, $descripcion, $stock);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "¡Producto creado exitosamente!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al guardar en la base de datos."]);
}

$stmt->close();
$conn->close();
?>