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

// 🦊 Datos de animales
const locations = [
  {
    name: "Amazonas",
    coords: [-60, -3],
    animal: {
      common: "Jaguar",
      scientific: "Panthera onca",
      description: "Depredador del Amazonas amenazado por la deforestación.",
      image: "assets/images/jaguar.jpg",
      video: "https://youtu.be/fE-6a1_pgPY?si=XGM3-uzKBIXM5rje"
    }
  },
  {
    name: "África Central",
    coords: [20, 0],
    animal: {
      common: "Gorila de montaña",
      scientific: "Gorilla beringei beringei",
      description: "Uno de los primates más amenazados del mundo actualmente.",
      image: "assets/images/gorila.jpeg",
      video: "https://youtu.be/6tCHfQz0Vt4?si=toy-e2qH1vY4IB2x"
    }
  },
  {
    name: "Australia",
    coords: [133, -25],
    animal: {
      common: "Demonio de Tasmania",
      scientific: "Sarcophilus harrisii",
      description: "Carnívoro en peligro crítico debido a un cáncer transmisible.",
      image: "assets/images/tasmania.jpeg",
      video: "https://youtube.com/shorts/1RSdaQV6a5k?si=Rj3RZOazFdrIqjED"
    }
  },
  {
    name: "China",
    coords: [105, 35],
    animal: {
      common: "Panda gigante",
      scientific: "Ailuropoda melanoleuca",
      description: "Símbolo de conservación en China, depende de los bosques de bambú.",
      image: "assets/images/Panda2.jpg",
      video: "https://youtu.be/6fe23yeoe54?si=OXXMNCQ-YyPenoJD"
    }
  },
  {
    name: "Madagascar",
    coords: [47, -20],
    animal: {
      common: "Lémur",
      scientific: "Lemur catta",
      description: "Endémico de Madagascar, amenazado por pérdida de hábitat.",
      image: "assets/images/lemur.jpeg",
      video: "https://youtu.be/MzdcfzT3glI?si=UnLe3IxW3wnamlbD"
    }
  },
  {
    name: "Siberia",
    coords: [105, 60],
    animal: {
      common: "Tigre siberiano",
      scientific: "Panthera tigris altaica",
      description: "Uno de los felinos más grandes y amenazados del mundo.",
      image: "assets/images/tigre.jpeg",
      video: "https://youtube.com/shorts/0TWT0a2VRlE?si=oICSfkl6yIAaCGDn"
    }
  },
  {
    name: "América del Norte",
    coords: [-100, 45],
    animal: {
      common: "Hurón de Patas Negras",
      scientific: "Mustela nigripes",
      description: "Depende de los perritos de la pradera, amenazado por pérdida de hábitat.",
      image: "assets/images/huron.jpeg",
      video: "https://youtube.com/shorts/EwXt7Mqey1o?si=zRlI2ti60jtjh0Pr"
    }
  },
  {
    name: "Islas Galápagos",
    coords: [-90, -0.5],
    animal: {
      common: "Tortuga gigante",
      scientific: "Chelonoidis nigra",
      description: "Especie icónica en peligro debido a especies invasoras.",
      image: "assets/images/tortuga.jpeg",
      video: "https://youtu.be/O1ElMch6Iik?si=EeeFlYyNHU77IKH8"
    }
  },
  {
    name: "Sudeste Asiático",
    coords: [105, 15],
    animal: {
      common: "Elefante asiático",
      scientific: "Elephas maximus",
      description: "Amenazado por caza furtiva y pérdida de hábitat.",
      image: "assets/images/elefante.jpeg",
      video: "https://youtu.be/1EiYvf0vmq8?si=RQSXp6nodnagbch1"
    }
  },
  {
    name: "Patagonia",
    coords: [-70, -45],
    animal: {
      common: "Guanaco",
      scientific: "Lama guanicoe",
      description: "Camélido sudamericano en áreas protegidas de la Patagonia.",
      image: "assets/images/guanaco.jpeg",
      video: "https://youtube.com/watch?v=TZor8AHBixU&feature=shared"
    }
  }
];
// 🔹 Crear marcadores con popups y degradado
locations.forEach((loc) => {
  // Crear marcador circular con imagen
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.width = '40px';
  el.style.height = '40px';
  el.style.backgroundImage = `url(${loc.animal.image})`;
  el.style.backgroundSize = 'cover';
  el.style.borderRadius = '50%';
  el.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';

  // Crear hitbox invisible más grande para facilitar click
  const hitbox = document.createElement('div');
  hitbox.style.width = '60px';
  hitbox.style.height = '60px';
  hitbox.style.borderRadius = '50%';
  hitbox.style.cursor = 'pointer';

  // Determinar color del degradado según zona
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
  const popupHTML = `
    <div style="
      width: 220px;
      border-radius: 12px;
      overflow: hidden;
      background: radial-gradient(circle at top, ${gradientColor} 0%, rgba(0,0,0,0.9) 80%);
      color: white;
      text-align: center;
      box-shadow: 0 6px 20px rgba(0,0,0,0.5);
      font-family: 'Poppins', sans-serif;
    ">
      <img src="${loc.animal.image}" style="width:100%; height:120px; object-fit:cover; margin-bottom:6px;"/>
      <h3 style="margin:4px 0 2px;">${loc.animal.common}</h3>
      <p style="margin:0; font-size:0.85rem; font-style:italic;">${loc.animal.scientific}</p>
      <p style="margin:6px 8px 8px; font-size:0.8rem;">${loc.animal.description}</p>
      <a href="${loc.animal.video}" target="_blank" class="video-link">Ver video</a>
    </div>
  `;

  // Crear marcador en Mapbox
  const marker = new mapboxgl.Marker(el)
    .setLngLat(loc.coords)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML))
    .addTo(map);

  // Click en hitbox dispara el popup
  el.appendChild(hitbox);
  hitbox.addEventListener('click', () => marker.togglePopup());
});

// === Animación de carátula y botón ===
window.addEventListener('load', () => {
  const loader = document.getElementById('intro');
  const stripes = loader.querySelectorAll('.stripe');
  const btn = document.getElementById('continuar-btn');

  // Al presionar "Continuar"
  btn.addEventListener('click', () => {
    // Activa animación de las bandas
    stripes.forEach((stripe, i) => {
      setTimeout(() => stripe.style.transform = 'translateY(100%)', i * 100);
    });

    // Luego desvanece el resto
    setTimeout(() => {
      loader.classList.add('fade-out');
    }, 800);

    // Finalmente elimina la carátula
    setTimeout(() => {
      loader.remove();
    }, 2300);
  });
});
// ---------- Control de la carátula / loader ----------
(function () {
  // Ejecutar cuando DOM esté listo
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    const loader = document.getElementById('intro');
    const btn = document.getElementById('continuar-btn');
    const stripes = loader ? loader.querySelectorAll('.stripe') : null;

    if (!loader) {
      console.warn('No se encontró #intro (carátula).');
      return;
    }
    if (!btn) {
      console.warn('No se encontró #continuar-btn (botón).');
      return;
    }
    // Al hacer click en Continuar
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Añadimos la clase 'loaded' para que las stripes hagan su transform
      loader.classList.add('loaded');

      // Si además quieres un efecto escalonado en cada stripe usando JS:
      if (stripes && stripes.length) {
        stripes.forEach((stripe, i) => {
          // pequeña separación entre cada stripe
          stripe.style.transitionDelay = `${i * 0.08}s`;
          // forzamos el transform (esto dispara la animación si tu CSS lo usa)
          stripe.style.transform = 'translateY(100%)';
        });
      }

      // Después de que las stripes bajen (esperar 800ms aprox), hacemos fade-out
      setTimeout(() => {
        loader.classList.add('fade-out');
      }, 850);

      // Eliminamos la carátula del DOM pasado el tiempo de la animación
      setTimeout(() => {
        if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
      }, 2400);
    });
  });
})();

