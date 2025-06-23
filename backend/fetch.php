<?php
$host = 'localhost';
$db   = 'portfoliodb';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
	PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
	PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
	PDO::ATTR_EMULATE_PREPARES   => false,
];

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

try {
	$pdo = new PDO($dsn, $user, $pass, $options);

	// Check if 'content' parameter is set and true
	$includeContent = isset($_GET['content']) && $_GET['content'] === 'true';

	$columns = 'id, title, description';
	if ($includeContent) {
		$columns .= ', content';
	}

	if (isset($_GET['id'])) {
		// Fetch single blog by id
		$stmt = $pdo->prepare("SELECT $columns FROM blogs WHERE id = ?");
		$stmt->execute([$_GET['id']]);
		$blog = $stmt->fetch();
		header('Content-Type: application/json');
		echo json_encode($blog);
	} else {
		// Fetch all blogs
		$stmt = $pdo->query("SELECT $columns FROM blogs");
		$blogs = $stmt->fetchAll();
		header('Content-Type: application/json');
		echo json_encode($blogs);
	}
} catch (\PDOException $e) {
	header('Content-Type: application/json', true, 500);
	echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
}
?>