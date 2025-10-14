// ==========================================
// 🔊 SISTEMA DE AUDIO
// ==========================================

const AudioSystem = {
  sounds: {
    buttonClick: new Audio('assets/sound/button-click.wav'),
    buttonHover: new Audio('assets/sound/button-hover.wav'),
    markerClick: new Audio('assets/sound/marker-click.wav'),
    popupOpen: new Audio('assets/sound/popup-open.wav'),
    backgroundMusic: new Audio('assets/sound/background-music.mp3')
  },

  init() {
    // Configurar música de fondo
    this.sounds.backgroundMusic.loop = true;
    this.sounds.backgroundMusic.volume = 0.3;

    // Configurar volúmenes de efectos
    this.sounds.buttonClick.volume = 0.5;
    this.sounds.buttonHover.volume = 0.3;
    this.sounds.markerClick.volume = 0.4;
    this.sounds.popupOpen.volume = 0.4;

    // Precargar sonidos
    Object.values(this.sounds).forEach(sound => {
      sound.load();
    });
  },

  play(soundName) {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(err => console.log('Error reproduciendo audio:', err));
    }
  },

  startBackgroundMusic() {
    this.sounds.backgroundMusic.play().catch(err => {
      console.log('Audio bloqueado por el navegador. Requiere interacción del usuario.');
    });
  },

  stopBackgroundMusic() {
    this.sounds.backgroundMusic.pause();
    this.sounds.backgroundMusic.currentTime = 0;
  },

  fadeIn(soundName, duration = 1000) {
    const sound = this.sounds[soundName];
    if (!sound) return;

    sound.volume = 0;
    sound.play().catch(err => console.log('Error en fadeIn:', err));

    const targetVolume = soundName === 'backgroundMusic' ? 0.3 : 0.5;
    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = targetVolume / steps;

    let currentStep = 0;
    const fadeInterval = setInterval(() => {
      currentStep++;
      sound.volume = Math.min(volumeStep * currentStep, targetVolume);
      
      if (currentStep >= steps) {
        clearInterval(fadeInterval);
      }
    }, stepTime);
  },

  fadeOut(soundName, duration = 1000) {
    const sound = this.sounds[soundName];
    if (!sound) return;

    const startVolume = sound.volume;
    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = startVolume / steps;

    let currentStep = 0;
    const fadeInterval = setInterval(() => {
      currentStep++;
      sound.volume = Math.max(startVolume - (volumeStep * currentStep), 0);
      
      if (currentStep >= steps) {
        clearInterval(fadeInterval);
        sound.pause();
        sound.currentTime = 0;
      }
    }, stepTime);
  }
};

// Inicializar sistema de audio
AudioSystem.init();

// ==========================================
// 🎬 CARÁTULA CON AUDIO
// ==========================================

(function () {
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

    if (!loader || !btn) {
      console.warn('No se encontró la carátula o el botón.');
      return;
    }

    // Hover en botón continuar
    btn.addEventListener('mouseenter', () => {
      AudioSystem.play('buttonHover');
    });

    // Click en Continuar
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      AudioSystem.play('buttonClick');
      
      loader.classList.add('loaded');

      if (stripes && stripes.length) {
        stripes.forEach((stripe, i) => {
          stripe.style.transitionDelay = `${i * 0.08}s`;
          stripe.style.transform = 'translateY(100%)';
        });
      }

      setTimeout(() => {
        loader.classList.add('fade-out');
      }, 850);

      setTimeout(() => {
        if (loader && loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
        // Iniciar música de fondo al entrar al mapa
        AudioSystem.fadeIn('backgroundMusic', 2000);
      }, 2400);
    });
  });
})();

// ==========================================
// 🎯 BOTÓN SCROLL CON AUDIO
// ==========================================

const scrollButton = document.getElementById("scrollButton");

scrollButton.addEventListener('mouseenter', () => {
  AudioSystem.play('buttonHover');
});

scrollButton.addEventListener("click", () => {
  AudioSystem.play('buttonClick');
  document.getElementById("map-section").scrollIntoView({ behavior: "smooth" });
});

// ==========================================
// 🌍 MAPA DE MAPBOX
// ==========================================

mapboxgl.accessToken = 'pk.eyJ1Ijoic3RldmllZ3JpZmZpbmRlc2lnbiIsImEiOiJja24waTQzeHYwbndvMnZtbnFrYXV3ZjdjIn0.zhhJzykz0VYq7RQWBJxh7A';

// Detectar dispositivo para ajustar zoom
const isMobile = window.innerWidth <= 768;
const initialZoom = isMobile ? 1.5 : 1.8;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/steviegriffindesign/clehjyzbi001k01s201eihjqn',
  projection: 'globe',
  zoom: initialZoom,
  center: [1.6889, 31.7091],
  minZoom: 1,
  maxZoom: 10
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

// Botón de rotación con audio
const btnSpin = document.getElementById('btn-spin');

btnSpin.addEventListener('mouseenter', () => {
  AudioSystem.play('buttonHover');
});

btnSpin.addEventListener('click', e => {
  AudioSystem.play('buttonClick');
  spinEnabled = !spinEnabled;
  if (spinEnabled) {
    spinGlobe();
    e.target.innerHTML = 'Pausar rotación';
  } else {
    map.stop();
    e.target.innerHTML = 'Iniciar rotación';
  }
});

spinGlobe();

// ==========================================
// 🦊 DATOS DE ANIMALES
// ==========================================

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

// ==========================================
// 🎯 CREAR MARCADORES CON AUDIO
// ==========================================

locations.forEach((loc) => {
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.width = '40px';
  el.style.height = '40px';
  el.style.backgroundImage = `url(${loc.animal.image})`;
  el.style.backgroundSize = 'cover';
  el.style.borderRadius = '50%';
  el.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
  el.style.border = '3px solid rgba(255,255,255,0.8)';
  el.style.transition = 'transform 0.2s ease';
  el.style.cursor = 'pointer';

  let gradientColor;
  switch (loc.name) {
    case "Amazonas":
    case "América del Norte":
    case "Patagonia":
      gradientColor = "rgba(34,197,94,0.3)"; break;
    case "África Central":
    case "Madagascar":
      gradientColor = "rgba(239,68,68,0.3)"; break;
    case "Australia":
      gradientColor = "rgba(245,158,11,0.3)"; break;
    case "China":
    case "Siberia":
    case "Sudeste Asiático":
      gradientColor = "rgba(59,130,246,0.3)"; break;
    default:
      gradientColor = "rgba(255,255,255,0.2)";
  }

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

  const marker = new mapboxgl.Marker(el)
    .setLngLat(loc.coords)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML))
    .addTo(map);

  // Audio en hover del marcador (directamente en el elemento)
  el.addEventListener('mouseenter', () => {
    AudioSystem.play('buttonHover');
    el.style.transform = 'scale(1.2)';
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = 'scale(1)';
  });

  // Audio al hacer click en marcador (directamente en el elemento)
  el.addEventListener('click', () => {
    AudioSystem.play('markerClick');
    setTimeout(() => {
      AudioSystem.play('popupOpen');
    }, 150);
  });
});

// ==========================================
// 🎵 CONTROL DE MÚSICA AL HACER SCROLL
// ==========================================

let musicPlaying = false;

const mapSection = document.getElementById('map-section');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !musicPlaying) {
      AudioSystem.fadeIn('backgroundMusic', 2000);
      musicPlaying = true;
    }
  });
}, { threshold: 0.3 });

observer.observe(mapSection);
