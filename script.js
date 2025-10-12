const scrollButton = document.getElementById("scrollButton");
scrollButton.addEventListener("click", () => {
  document.getElementById("map-section").scrollIntoView({ behavior: "smooth" });
});


mapboxgl.accessToken = 'pk.eyJ1Ijoic3RldmllZ3JpZmZpbmRlc2lnbiIsImEiOiJja24waTQzeHYwbndvMnZtbnFrYXV3ZjdjIn0.zhhJzykz0VYq7RQWBJxh7A';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/steviegriffindesign/clehjyzbi001k01s201eihjqn',
  projection: 'globe',
  zoom: 2.5,
  minZoom: 1.5, // 🔹 Reduce el zoom mínimo
  maxZoom: 4.5, // 🔹 Limita el zoom máximo
  center: [0, 20]
});

map.on('style.load', () => {
  map.setFog({
    "range": [0.8, 8],
    "color": "rgba(118, 143, 152, 0.35)",
    "horizon-blend": 0.05,
    "high-color": "#244b5a",
    "space-color": "#0e2a33",
    "star-intensity": 0.15
  });
});

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
    map.easeTo({ center, duration: 1000, easing: (n) => n });
  }
}

map.on('mousedown', () => (userInteracting = true));
map.on('mouseup', () => ((userInteracting = false), spinGlobe()));
map.on('dragend', () => ((userInteracting = false), spinGlobe()));
map.on('pitchend', () => ((userInteracting = false), spinGlobe()));
map.on('rotateend', () => ((userInteracting = false), spinGlobe()));
map.on('moveend', spinGlobe);

document.getElementById('btn-spin').addEventListener('click', (e) => {
  spinEnabled = !spinEnabled;
  if (spinEnabled) {
    spinGlobe();
    e.target.innerHTML = 'Pausar rotación';
  } else {
    map.stop();
    e.target.innerHTML = 'Reanudar rotación';
  }
});

spinGlobe();
