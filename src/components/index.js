// index.js - Point d'entrée de l'application
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

// Fonction pour charger les données de trafic
async function loadTrafficData() {
  try {
    // Pour une vraie implémentation, remplacez par votre API
    // const response = await fetch("https://your-api-endpoint.com/traffic-data");
    // return await response.json();
    
    // Utilisation de données d'exemple
    return sampleTrafficData();
  } catch (error) {
    console.error("Erreur de chargement des données:", error);
    return sampleTrafficData();
  }
}

function sampleTrafficData() {
  // Réseau routier avec conditions de trafic
  return [
    {id: "r1", startNode: "A", endNode: "B", distance: 5, currentSpeed: 30, maxSpeed: 50, 
     startLat: 48.856, startLng: 2.352, endLat: 48.860, endLng: 2.347},
    {id: "r2", startNode: "B", endNode: "C", distance: 3, currentSpeed: 40, maxSpeed: 50, 
     startLat: 48.860, startLng: 2.347, endLat: 48.865, endLng: 2.342},
    {id: "r3", startNode: "A", endNode: "D", distance: 4, currentSpeed: 15, maxSpeed: 50, 
     startLat: 48.856, startLng: 2.352, endLat: 48.854, endLng: 2.345},
    {id: "r4", startNode: "D", endNode: "C", distance: 6, currentSpeed: 45, maxSpeed: 50, 
     startLat: 48.854, startLng: 2.345, endLat: 48.865, endLng: 2.342},
    {id: "r5", startNode: "B", endNode: "E", distance: 4, currentSpeed: 50, maxSpeed: 50, 
     startLat: 48.860, startLng: 2.347, endLat: 48.863, endLng: 2.338},
    {id: "r6", startNode: "E", endNode: "C", distance: 2, currentSpeed: 35, maxSpeed: 50, 
     startLat: 48.863, startLng: 2.338, endLat: 48.865, endLng: 2.342}
  ];
}

// Préparation des données pour visualisation
function prepareVisualizationData(trafficData) {
  // Transformer en format adapté pour Plot
  return trafficData.map(road => ({
    id: road.id,
    startNode: road.startNode,
    endNode: road.endNode,
    speed: road.currentSpeed,
    maxSpeed: road.maxSpeed,
    distance: road.distance,
    congestion: 1 - (road.currentSpeed / road.maxSpeed),
    line: {
      coordinates: [
        [road.startLng, road.startLat],
        [road.endLng, road.endLat]
      ]
    }
  }));
}

// Construire le graphe routier
function buildRoadGraph(trafficData) {
  const graph = {};
  
  // Initialiser les nœuds
  trafficData.forEach(road => {
    if (!graph[road.startNode]) graph[road.startNode] = {};
    if (!graph[road.endNode]) graph[road.endNode] = {};
  });
  
  // Ajouter les arêtes avec poids basés sur les conditions de trafic
  trafficData.forEach(road => {
    const travelTime = road.distance / (road.currentSpeed / 60); // en minutes
    const congestionFactor = 1 + Math.max(0, (road.maxSpeed - road.currentSpeed) / road.maxSpeed);
    
    graph[road.startNode][road.endNode] = {
      roadId: road.id,
      weight: travelTime * congestionFactor,
      distance: road.distance,
      currentSpeed: road.currentSpeed
    };
  });
  
  return graph;
}

// Algorithme de Dijkstra pour trouver le meilleur itinéraire
function findBestRoute(graph, start, end) {
  const queue = Object.keys(graph).map(node => ({
    node,
    distance: node === start ? 0 : Infinity,
    visited: false,
    previous: null,
    path: []
  }));
  
  while (true) {
    queue.sort((a, b) => a.distance - b.distance);
    const current = queue.find(n => !n.visited);
    
    if (!current || current.distance === Infinity) break;
    if (current.node === end) break;
    
    current.visited = true;
    
    Object.entries(graph[current.node]).forEach(([neighbor, edge]) => {
      const neighborNode = queue.find(n => n.node === neighbor);
      if (neighborNode && !neighborNode.visited) {
        const newDistance = current.distance + edge.weight;
        
        if (newDistance < neighborNode.distance) {
          neighborNode.distance = newDistance;
          neighborNode.previous = current.node;
          neighborNode.path = [...current.path, {
            from: current.node,
            to: neighbor,
            roadId: edge.roadId
          }];
        }
      }
    });
  }
  
  const result = queue.find(n => n.node === end);
  return {
    path: result.path,
    totalTime: result.distance,
    success: result.previous !== null || start === end
  };
}

// Fonction pour obtenir les données de routes avec indication du meilleur itinéraire
function getRoutesWithBestPath(trafficData, bestRoute) {
  const visualData = prepareVisualizationData(trafficData);
  
  // Marquer les routes qui font partie du meilleur itinéraire
  return visualData.map(road => ({
    ...road,
    isOnBestRoute: bestRoute.path.some(segment => segment.roadId === road.id)
  }));
}

// Obtenir les coordonnées des nœuds du graphe
function getNodeCoordinates(trafficData) {
  const nodes = {};
  
  // Extraire tous les nœuds uniques
  trafficData.forEach(road => {
    if (!nodes[road.startNode]) {
      nodes[road.startNode] = {
        id: road.startNode,
        lat: road.startLat,
        lng: road.startLng
      };
    }
    
    if (!nodes[road.endNode]) {
      nodes[road.endNode] = {
        id: road.endNode,
        lat: road.endLat,
        lng: road.endLng
      };
    }
  });
  
  return Object.values(nodes);
}

// Fonction principale qui crée la visualisation
async function createTrafficVisualization(startNode, endNode, container) {
  // Charger les données
  const trafficData = await loadTrafficData();
  
  // Construire le graphe
  const roadGraph = buildRoadGraph(trafficData);
  
  // Trouver le meilleur itinéraire
  const bestRoute = findBestRoute(roadGraph, startNode, endNode);
  
  // Préparer les données pour la visualisation
  const visualizationData = getRoutesWithBestPath(trafficData, bestRoute);
  
  // Obtenir les coordonnées des nœuds
  const nodes = getNodeCoordinates(trafficData);
  
  // Créer la visualisation avec Plot
  const plot = Plot.plot({
    projection: "mercator",
    r: { range: [5, 10] },
    color: { legend: true },
    marks: [
      // Dessiner toutes les routes
      Plot.line(visualizationData, {
        x: d => d.line.coordinates[0][0],
        y: d => d.line.coordinates[0][1],
        x2: d => d.line.coordinates[1][0],
        y2: d => d.line.coordinates[1][1],
        stroke: d => d.isOnBestRoute ? "#0047AB" : d3.interpolateRdYlGn(1 - d.congestion),
        strokeWidth: d => d.isOnBestRoute ? 4 : 2,
        strokeOpacity: d => d.isOnBestRoute ? 1 : 0.7,
        tip: true,
        title: d => `Route ${d.id}: ${d.startNode} → ${d.endNode}
                    Vitesse: ${d.speed} km/h
                    Congestion: ${Math.round(d.congestion * 100)}%`
      }),
      
      // Afficher les nœuds
      Plot.dot(nodes, {
        x: d => d.lng,
        y: d => d.lat,
        fill: d => (d.id === startNode) ? "green" : (d.id === endNode) ? "red" : "#666",
        r: d => (d.id === startNode || d.id === endNode) ? 8 : 5,
        title: d => `Point ${d.id}`
      }),
      
      // Ajouter des étiquettes pour les nœuds
      Plot.text(nodes, {
        x: d => d.lng,
        y: d => d.lat,
        text: d => d.id,
        dy: -10,
        fontSize: 14,
        fontWeight: "bold"
      })
    ],
    style: {
      background: "#f5f5f5",
      padding: "20px",
      overflow: "visible"
    },
    width: 800,
    height: 600,
    margins: 40
  });
  
  // Vider le conteneur et ajouter la visualisation
  container.innerHTML = '';
  container.appendChild(plot);
  
  // Retourner les infos sur l'itinéraire
  return {
    route: bestRoute,
    estimatedTime: Math.round(bestRoute.totalTime),
    roads: bestRoute.path.map(segment => segment.roadId)
  };
}

// Initialisation de l'interface utilisateur
document.addEventListener("DOMContentLoaded", async () => {
  // Créer les éléments de l'interface
  const app = document.createElement("div");
  app.innerHTML = `
    <h1>Prédicteur d'Itinéraire de Trafic</h1>
    
    <div class="controls" style="margin-bottom: 20px;">
      <label for="start-node">Point de départ:</label>
      <select id="start-node">
        <option value="A">Point A</option>
        <option value="B">Point B</option>
        <option value="D">Point D</option>
      </select>
      
      <label for="end-node" style="margin-left: 20px;">Destination:</label>
      <select id="end-node">
        <option value="C">Point C</option>
        <option value="E">Point E</option>
      </select>
      
      <button id="find-route" style="margin-left: 20px;">Trouver le meilleur itinéraire</button>
    </div>
    
    <div id="map-container" style="height: 600px; width: 100%; border: 1px solid #ccc;"></div>
    
    <div id="route-info" style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
      <h3>Informations sur l'itinéraire</h3>
      <p>Sélectionnez des points et cliquez sur "Trouver le meilleur itinéraire" pour voir le chemin optimal.</p>
    </div>
  `;
  
  document.body.prepend(app);
  
  // Récupérer les références aux éléments
  const startNodeSelect = document.getElementById("start-node");
  const endNodeSelect = document.getElementById("end-node");
  const findRouteButton = document.getElementById("find-route");
  const mapContainer = document.getElementById("map-container");
  const routeInfoDiv = document.getElementById("route-info");
  
  // Ajouter l'événement au bouton
  findRouteButton.addEventListener("click", async () => {
    const startNode = startNodeSelect.value;
    const endNode = endNodeSelect.value;
    
    routeInfoDiv.innerHTML = `<p>Calcul du meilleur itinéraire de ${startNode} à ${endNode}...</p>`;
    
    try {
      const routeResult = await createTrafficVisualization(startNode, endNode, mapContainer);
      
      // Afficher les informations sur l'itinéraire
      routeInfoDiv.innerHTML = `
        <h3>Informations sur l'itinéraire</h3>
        <p><strong>De:</strong> ${startNode} à ${endNode}</p>
        <p><strong>Temps de trajet estimé:</strong> ${routeResult.estimatedTime} minutes</p>
        <p><strong>Itinéraire:</strong> ${routeResult.route.path.map(segment => 
          `${segment.from} → ${segment.to}`).join(' → ')}</p>
        <p><strong>Conditions de trafic:</strong> Les couleurs sur la carte indiquent les vitesses actuelles 
          (rouge = congestionné, jaune = modéré, vert = fluide).</p>
      `;
    } catch (error) {
      routeInfoDiv.innerHTML = `
        <h3>Erreur</h3>
        <p>Échec du calcul de l'itinéraire: ${error.message}</p>
      `;
    }
  });
  
  // Initialiser la carte avec un itinéraire par défaut
  createTrafficVisualization("A", "C", mapContainer);
});

export default function define() {
  return {
    title: "Prédicteur d'Itinéraire de Trafic",
    description: "Prédit le meilleur itinéraire en fonction des conditions de trafic actuelles"
  };
}