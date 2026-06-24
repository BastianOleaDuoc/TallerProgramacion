<?php

$headers = getallheaders();


$admin_email = null;
foreach ($headers as $key => $value) {
    if (strtolower($key) === 'x-admin-email') {
        $admin_email = trim($value);
        break;
    }
}

if (!$admin_email) {
    http_response_code(403); // Código HTTP: Prohibido / No autorizado
    echo json_encode([
        "status" => "error",
        "message" => "Acceso denegado: No se detectaron credenciales administrativas válidas."
    ]);
    exit; 
}


if (isset($conn)) {

    $query = "SELECT id FROM usuarios WHERE email = :email AND rol = 'admin' LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->execute([':email' => $admin_email]);
    
    if ($stmt->rowCount() === 0) {
        http_response_code(403);
        echo json_encode([
            "status" => "error",
            "message" => "Acceso denegado: El usuario provisto no tiene permisos de administrador."
        ]);
        exit;
    }
}
?>