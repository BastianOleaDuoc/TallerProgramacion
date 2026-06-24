<?php
require_once "../config/conexion.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $email = trim($_POST["email"]);
    $password = $_POST["password"];

    // Buscamos en la tabla de administradores
    $sql = "SELECT * FROM administradores WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();

    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        $admin = $resultado->fetch_assoc();

        // Validamos la contraseña encriptada
        if (password_verify($password, $admin["password"])) {
            echo "Login admin correcto"; 
        } else {
            echo "Contraseña incorrecta";
        }

    } else {
        echo "Acceso denegado: Usuario no autorizado";
    }

    $stmt->close();
}

if (isset($conn)) { $conn->close(); }
?>