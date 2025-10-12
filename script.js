const scrollButton = document.getElementById("scrollButton");
scrollButton.addEventListener("click", () => {
  document.getElementById("map-section").scrollIntoView({ behavior: "smooth" });
});


// 🔹 Inicializar mapa de Mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoic3RldmllZ3JpZmZpbmRlc2lnbiIsImEiOiJja24waTQzeHYwbndvMnZtbnFrYXV3ZjdjIn0.zhhJzykz0VYq7RQWBJxh7A';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/steviegriffindesign/clehjyzbi001k01s201eihjqn',
  projection: 'globe',
  zoom: 2.3,
  center: [1.6889, 31.7091]
});

map.on('style.load', () => {
  map.setFog({
    range: [0.8, 8],
    color: "rgba(118,143,152,0.4)",
    "horizon-blend": 0.05,
    "high-color": "#244b5a",
    "space-color": "#0e2a33",
    "star-intensity": 0.1
  });
});

// 🌍 Rotación del globo
const secondsPerRevolution = 120;
const maxSpinZoom = 5;
const slowSpinZoom = 3;

let userInteracting = false;
let spinEnabled = true;

function spinGlobe() {
  const zoom = map.getZoom();
  if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
    let distancePerSecond = 360 / secondsPerRevolution;
    if (zoom > slowSpinZoom) {
      const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
      distancePerSecond *= zoomDif;
    }
    const center = map.getCenter();
    center.lng -= distancePerSecond;
    map.easeTo({ center, duration: 1000, easing: n => n });
  }
}

map.on('mousedown', () => userInteracting = true);
map.on('mouseup', () => { userInteracting = false; spinGlobe(); });
map.on('dragend', () => { userInteracting = false; spinGlobe(); });
map.on('pitchend', () => { userInteracting = false; spinGlobe(); });
map.on('rotateend', () => { userInteracting = false; spinGlobe(); });
map.on('moveend', () => spinGlobe());

document.getElementById('btn-spin').addEventListener('click', e => {
  spinEnabled = !spinEnabled;
  if (spinEnabled) {
    spinGlobe();
    e.target.innerHTML = 'Pause rotation';
  } else {
    map.stop();
    e.target.innerHTML = 'Start rotation';
  }
});

spinGlobe();

// 🦊 Datos de animales (mismos que antes)
const locations = [
  { name: "Amazonas", coords: [-60, -3], animal: { common: "Jaguar", scientific: "Panthera onca", description: "Depredador del Amazonas amenazado por la deforestación.", image: "assets/images/jaguar.jpg" } },
  { name: "África Central", coords: [20, 0], animal: { common: "Gorila de montaña", scientific: "Gorilla beringei beringei", description: "Uno de los primates más amenazados del mundo.", image: "assets/images/gorila.jpeg" } },
  { name: "Australia", coords: [133, -25], animal: { common: "Demonio de Tasmania", scientific: "Sarcophilus harrisii", description: "Carnívoro en peligro crítico debido a un cáncer transmisible.", image: "assets/images/tasmania.jpeg" } },
  { name: "China", coords: [105, 35], animal: { common: "Panda gigante", scientific: "Ailuropoda melanoleuca", description: "Símbolo de conservación en China, depende de los bosques de bambú.", image: "assets/images/Panda2.jpg" } },
  { name: "Madagascar", coords: [47, -20], animal: { common: "Lémur", scientific: "Lemur catta", description: "Endémico de Madagascar, amenazado por pérdida de hábitat.", image: "assets/images/lemur.jpeg" } },
  { name: "Siberia", coords: [105, 60], animal: { common: "Tigre siberiano", scientific: "Panthera tigris altaica", description: "Uno de los felinos más grandes y amenazados del mundo.", image: "assets/images/tigre.jpeg" } },
  { name: "América del Norte", coords: [-100, 45], animal: { common: "Hurón de Patas Negras", scientific: "Mustela nigripes", description: "Depende de los perritos de la pradera, amenazado por pérdida de hábitat.", image: "assets/images/huron.jpeg" } },
  { name: "Islas Galápagos", coords: [-90, -0.5], animal: { common: "Tortuga gigante", scientific: "Chelonoidis nigra", description: "Especie icónica en peligro debido a especies invasoras.", image: "assets/images/tortuga.jpeg" } },
  { name: "Sudeste Asiático", coords: [105, 15], animal: { common: "Elefante asiático", scientific: "Elephas maximus", description: "Amenazado por caza furtiva y pérdida de hábitat.", image: "assets/images/elefante.jpeg" } },
  { name: "Patagonia", coords: [-70, -45], animal: { common: "Guanaco", scientific: "Lama guanicoe", description: "Camélido sudamericano en áreas protegidas de la Patagonia.", image: "assets/images/guanaco.jpeg" } }
];

// 📍 Agregar marcadores y tarjetas
locations.forEach(loc => {
  // Crear marcador personalizado
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.width = '14px';
  el.style.height = '14px';
  el.style.background = '#4ade80';
  el.style.borderRadius = '50%';
  el.style.boxShadow = '0 0 12px rgba(74,222,128,0.6)';
  el.style.cursor = 'pointer';

  // Crear popup
  const popupHTML = `
    <div style="
      width:220px;
      border-radius:12px;
      overflow:hidden;
      background:radial-gradient(circle at top, rgba(74,222,128,0.3), rgba(0,0,0,0.9));
      color:white;
      text-align:center;
      box-shadow:0 4px 20px rgba(0,0,0,0.5);
      font-family: 'Poppins', sans-serif;
    ">
      <img src="${loc.animal.image}" style="width:100%;height:120px;object-fit:cover;">
      <h3 style="margin:8px 0 2px;">${loc.animal.common}</h3>
      <p style="margin:0;font-size:0.85rem;font-style:italic;">${loc.animal.scientific}</p>
      <p style="margin:6px;font-size:0.8rem;">${loc.animal.description}</p>
    </div>
  `;

  new mapboxgl.Marker(el)
    .setLngLat(loc.coords)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML))
    .addTo(map);
});


spinGlobe();
