<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");


require_once "../config/conexion.php";


$sql = "SELECT id, nombre, categoria, precio, imagen, descripcion, stock FROM productos ORDER BY categoria ASC, id ASC";
$resultado = $conn->query($sql);

$productos = [];

if ($resultado && $resultado->num_rows > 0) {
    while ($fila = $resultado->fetch_assoc()) {
     
        $productos[] = [
            "id" => (int)$fila["id"],
            "name" => $fila["nombre"],       
            "category" => $fila["categoria"],
            "price" => (int)$fila["precio"],  
            "img" => "../img/" . $fila["imagen"], 
            "description" => $fila["descripcion"],
            "stock" => (int)$fila["stock"]
        ];
    }
   
    echo json_encode(["status" => "success", "data" => $productos]);
} else {

    echo json_encode(["status" => "success", "data" => [], "message" => "No se encontraron productos"]);
}

if (isset($conn)) { $conn->close(); }
?>