<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prédicteur d'Itinéraire de Trafic</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #2c3e50;
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    select, button {
      padding: 8px 12px;
      font-size: 16px;
      border-radius: 4px;
    }
    button {
      background-color: #3498db;
      color: white;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    button:hover {
      background-color: #2980b9;
    }
    #map-container {
      margin: 20px 0;
      border-radius: 8px;
      overflow: hidden;
    }
    #route-info {
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <!-- App will be loaded here ! -->
  <script type="module" src="components/index.js"></script>
</body>
</html>