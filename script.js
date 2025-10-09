const scrollButton = document.getElementById("scrollButton");
scrollButton.addEventListener("click", () => {
  document.getElementById("map-section").scrollIntoView({ behavior: "smooth" });
});


// Inicializar mapa
const map = L.map("map", {
  worldCopyJump: false,
  maxBoundsViscosity: 1.0,
  maxBounds: [[-85, -180], [85, 180]],
  zoomSnap: 0.25,
  zoomControl: false
}).setView([10, 0], 2);

// 🔹 Capa base (esta es la que dibuja el mapa)
L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
  attribution: "© OpenStreetMap, © CARTO",
  minZoom: 2,
  maxZoom: 3.5,
  noWrap: true
}).addTo(map);


// Datos de ejemplo
const locations = [
  {
    name: "Amazonas",
    coords: [-3, -60],
    animals: [
      {
        common: "Jaguar",
        scientific: "Panthera onca",
        description: "Depredador del Amazonas amenazado por la deforestación.",
        image: "assets/images/jaguar.jpg"
      }
    ]
  },
  {
    name: "África Central",
    coords: [0, 20],
    animals: [
      {
        common: "Gorila de montaña",
        scientific: "Gorilla beringei beringei",
        description: "Uno de los primates más amenazados del mundo.",
        image: "assets/images/gorila.jpeg"
      }
    ]
  },
  {
    name: "Australia",
    coords: [-25, 133],
    animals: [
      {
        common: "Demonio de Tasmania",
        scientific: "Sarcophilus harrisii",
        description: "Carnívoro en peligro crítico debido a un cáncer transmisible.",
        image: "assets/images/tasmania.jpeg"
      }
    ]
  },
  {
    name: "China",
    coords: [35, 105],
    animals: [
      {
        common: "Panda gigante",
        scientific: "Ailuropoda melanoleuca",
        description: "Símbolo de conservación en China, depende de los bosques de bambú.",
        image: "assets/images/Panda2.jpg"
      }
    ]
  },
  {
    name: "Madagascar",
    coords: [-20, 47],
    animals: [
      {
        common: "Lémur",
        scientific: "Lemur catta",
        description: "Endémico de Madagascar, amenazado por pérdida de hábitat.",
        image: "assets/images/lemur.jpeg"
      }
    ]
  },
  {
    name: "Siberia",
    coords: [60, 105],
    animals: [
      {
        common: "Tigre siberiano",
        scientific: "Panthera tigris altaica",
        description: "Uno de los felinos más grandes y amenazados del mundo.",
        image: "assets/images/tigre.jpeg"
      }
    ]
  },
  {
    name: "América del Norte",
    coords: [45, -100],
    animals: [
      {
        common: "Hurón de Patas Negras",
        scientific: "Mustela nigripes",
        description: "Depende de los perritos de la pradera (su principal alimento y hogar), amenazado por la pérdida de hábitat y la peste silvestre.",
        image: "assets/images/huron.jpeg"
      }
    ]
  },
  {
    name: "Islas Galápagos",
    coords: [-0.5, -90],
    animals: [
      {
        common: "Tortuga gigante",
        scientific: "Chelonoidis nigra",
        description: "Especie icónica en peligro debido a especies invasoras.",
        image: "assets/images/tortuga.jpeg"
      }
    ]
  },
  {
    name: "Sudeste Asiático",
    coords: [15, 105],
    animals: [
      {
        common: "Elefante asiático",
        scientific: "Elephas maximus",
        description: "Amenazado por caza furtiva y pérdida de hábitat.",
        image: "assets/images/elefante.jpeg"
      }
    ]
  },
  {
    name: "Patagonia",
    coords: [-45, -70],
    animals: [
      {
        common: "Guanaco",
        scientific: "Lama guanicoe",
        description: "Camélido sudamericano en áreas protegidas de la Patagonia.",
        image: "assets/images/guanaco.jpeg"
      }
    ]
  }
];


// 📜 Tarjeta flotante (si quieres usar HTML flotante)
const card = document.getElementById("animal-card");
const img = document.getElementById("animal-image");
const common = document.getElementById("animal-common");
const scientific = document.getElementById("animal-scientific");
const desc = document.getElementById("animal-description");

// 🐾 Crear marcadores con hitbox y popup elegante
locations.forEach(loc => {
  // Marcador visible
  const marker = L.circleMarker(loc.coords, {
    color: "#4ade80",
    fillColor: "#4ade80",
    fillOpacity: 0.7,
    radius: 8,
    interactive: true,
    weight: 2
  }).addTo(map);

  // Hitbox invisible más grande
  const hitbox = L.circleMarker(loc.coords, {
    radius: 15,
    opacity: 0,
    fillOpacity: 0,
    interactive: true
  }).addTo(map);

  // Click en hitbox dispara el marcador
  hitbox.on("click", () => marker.fire("click"));

  // Evento click del marcador
  marker.on("click", () => {
    const animal = loc.animals[0];

    // Color del degradado según zona
    let gradientColor;
    switch (loc.name) {
      case "Amazonas":
      case "América del Norte":
      case "Patagonia":
        gradientColor = "rgba(34,197,94,0.3)"; break; // verde
      case "África Central":
      case "Madagascar":
        gradientColor = "rgba(239,68,68,0.3)"; break; // rojo
      case "Australia":
        gradientColor = "rgba(245,158,11,0.3)"; break; // naranja
      case "China":
      case "Siberia":
      case "Sudeste Asiático":
        gradientColor = "rgba(59,130,246,0.3)"; break; // azul
      default:
        gradientColor = "rgba(255,255,255,0.2)";
    }

    // Contenido del popup
    const content = `
      <div style="
        width: 220px;
        text-align:center;
        border-radius:12px;
        padding:10px;
        background: radial-gradient(circle at top, ${gradientColor} 0%, rgba(0,0,0,0.85) 80%);
        color:white;
        box-shadow: 0 6px 20px rgba(0,0,0,0.5);
      ">
        <img src="${animal.image}" style="width:100%; border-radius:8px; margin-bottom:8px;" />
        <h3 style="margin:0; font-size:1.1rem;">${animal.common}</h3>
        <p style="margin:2px 0; font-size:0.9rem; font-style:italic;">${animal.scientific}</p>
        <p style="font-size:0.85rem;">${animal.description}</p>
      </div>
    `;

    marker.bindPopup(content, { closeButton: true, autoPan: true }).openPopup();
  });
});
