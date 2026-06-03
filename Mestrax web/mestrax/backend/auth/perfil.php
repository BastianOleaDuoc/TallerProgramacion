<?php

require_once "../config/conexion.php"; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST["email"]);

    $sql = "SELECT nombre, email, fecha_registro FROM usuarios WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        $usuario = $resultado->fetch_assoc();
        echo json_encode([
            "status" => "success",
            "nombre" => $usuario["nombre"],
            "email" => $usuario["email"],
            "fechaRegistro" => $usuario["fecha_registro"] ?? date("Y-m-d")
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
    }
    $stmt->close();
}
if (isset($conn)) { $conn->close(); }
?>