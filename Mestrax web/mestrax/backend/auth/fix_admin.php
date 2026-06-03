<?php
require_once "../config/conexion.php";


$password_limpia = "admin123";
$hash_perfecto = password_hash($password_limpia, PASSWORD_DEFAULT);
$email_admin = "admin@mestrax.com";


$conn->query("DELETE FROM administradores WHERE email = '$email_admin'");


$sql = "INSERT INTO administradores (email, password) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email_admin, $hash_perfecto);

if ($stmt->execute()) {
    echo "<h1>¡Éxito total!</h1>";
    echo "<p>El administrador <strong>$email_admin</strong> ha sido configurado con la contraseña <strong>$password_limpia</strong> de forma segura.</p>";
} else {
    echo "<h1>Error</h1>" . $conn->error;
}

$stmt->close();
$conn->close();
?>