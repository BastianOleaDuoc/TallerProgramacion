<?php
require_once "../config/conexion.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $email = trim($_POST["email"]);
    $password = $_POST["password"];

    $sql = "SELECT * FROM usuarios WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();

    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 1) {
        $usuario = $resultado->fetch_assoc();

        // Si la contraseña es correcta, imprimimos SOLO "Login correcto"
        if (password_verify($password, $usuario["password"])) {
            echo "Login correcto"; 
        } else {
            echo "Contraseña incorrecta";
        }

    } else {
        echo "Usuario no encontrado";
    }

    $stmt->close();
}

if (isset($conn)) { $conn->close(); }
?>