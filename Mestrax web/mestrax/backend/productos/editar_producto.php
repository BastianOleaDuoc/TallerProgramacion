<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/conexion.php";

if (empty($_POST['id']) || empty($_POST['nombre']) || empty($_POST['categoria']) || empty($_POST['precio'])) {
    echo json_encode(["status" => "error", "message" => "Faltan datos obligatorios para actualizar."]);
    exit;
}

$id = (int)$_POST['id'];
$nombre = trim($_POST['nombre']);
$categoria = trim($_POST['categoria']);
$precio = (int)$_POST['precio'];
$descripcion = trim($_POST['descripcion']);
$stock = (int)$_POST['stock'];

// Primero buscamos si se subió una nueva imagen
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['imagen']['tmp_name'];
    $fileName = $_FILES['imagen']['name'];
    $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    
    $nombre_imagen = time() . "_edit_" . $id . "." . $fileExtension;
    $uploadFileDir = '../../frontend/img/';
    
    if(move_uploaded_file($fileTmpPath, $uploadFileDir . $nombre_imagen)) {
        // actualizamos la nueva imagen
        $stmt = $conn->prepare("UPDATE productos SET nombre=?, categoria=?, precio=?, imagen=?, descripcion=?, stock=? WHERE id=?");
        $stmt->bind_param("ssissii", $nombre, $categoria, $precio, $nombre_imagen, $descripcion, $stock, $id);
    }
} else {
    // acualizamos sin cambiar la imagen actual
    $stmt = $conn->prepare("UPDATE productos SET nombre=?, categoria=?, precio=?, descripcion=?, stock=? WHERE id=?");
    $stmt->bind_param("ssisii", $nombre, $categoria, $precio, $descripcion, $stock, $id);
}

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Producto actualizado con éxito."]);
} else {
    echo json_encode(["status" => "error", "message" => "Error al actualizar en la base de datos."]);
}

$stmt->close();
$conn->close();
?>