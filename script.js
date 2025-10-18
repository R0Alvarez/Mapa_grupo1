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
// 🌍 MAPA DE MAPBOX CON ZOOM AJUSTADO
// ==========================================

mapboxgl.accessToken = 'pk.eyJ1Ijoic3RldmllZ3JpZmZpbmRlc2lnbiIsImEiOiJja24waTQzeHYwbndvMnZtbnFrYXV3ZjdjIn0.zhhJzykz0VYq7RQWBJxh7A';

// 🔧 Detectar dispositivo y ajustar zoom inicial
const isMobile = window.innerWidth <= 768;
const initialZoom = isMobile ? 1.5 : 1.3;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/steviegriffindesign/clehjyzbi001k01s201eihjqn',
  projection: 'globe',
  zoom: initialZoom,
  center: [1.6889, 31.7091],
  minZoom: 0.8,
  maxZoom: 6
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

// 🌍 Rotación del globo (ajustado para mejor visualización)
const secondsPerRevolution = 120;
const maxSpinZoom = 4;
const slowSpinZoom = 2.5;

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

  const hitbox = document.createElement('div');
  hitbox.style.width = '60px';
  hitbox.style.height = '60px';
  hitbox.style.borderRadius = '50%';
  hitbox.style.cursor = 'pointer';

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
      width: 280px;
      border-radius: 20px;
      overflow: hidden;
      background: linear-gradient(145deg, #1a1a1a, #0a0a0a);
      color: white;
      box-shadow: 
        inset 2px 2px 5px rgba(0,0,0,0.5),
        inset -2px -2px 5px rgba(60,60,60,0.1),
        0 10px 30px rgba(0,0,0,0.8);
      font-family: 'Poppins', sans-serif;
      border: 2px solid;
      border-image: linear-gradient(135deg, ${gradientColor.replace('0.3', '0.8')}, ${gradientColor.replace('0.3', '0.3')}) 1;
      position: relative;
    ">
      <!-- Imagen del animal -->
      <div style="position: relative; overflow: hidden;">
        <img src="${loc.animal.image}" style="
          width: 100%; 
          height: 180px; 
          object-fit: cover;
          filter: brightness(0.9) contrast(1.1);
        "/>
        <div style="
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
        "></div>
      </div>

      <!-- Contenido -->
      <div style="padding: 15px 20px 20px; position: relative;">
        <!-- Nombre común -->
        <h3 style="
          margin: 0 0 5px;
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          background: linear-gradient(135deg, #ffffff, ${gradientColor.replace('0.3', '1')});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        ">${loc.animal.common}</h3>

        <!-- Nombre científico -->
        <p style="
          margin: 0 0 12px;
          font-size: 0.85rem;
          font-style: italic;
          opacity: 0.7;
          letter-spacing: 0.3px;
        ">${loc.animal.scientific}</p>

        <!-- Descripción -->
        <p style="
          margin: 0 0 15px;
          font-size: 0.9rem;
          line-height: 1.5;
          opacity: 0.85;
        ">${loc.animal.description}</p>

        <!-- Botón Ver Video (estilo switch) -->
        <div style="
          display: flex;
          justify-content: flex-end;
          align-items: center;
        ">
          <a href="${loc.animal.video}" target="_blank" style="
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
            border: 2px solid ${gradientColor.replace('0.3', '0.6')};
            border-radius: 25px;
            color: white;
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 500;
            letter-spacing: 0.5px;
            box-shadow: 
              inset 2px 2px 4px rgba(0,0,0,0.3),
              inset -2px -2px 4px rgba(60,60,60,0.1),
              0 4px 10px rgba(0,0,0,0.4);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          " onmouseover="
            this.style.transform='translateY(-2px)';
            this.style.boxShadow='inset 2px 2px 4px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(60,60,60,0.1), 0 6px 15px rgba(0,0,0,0.6)';
            this.style.borderColor='${gradientColor.replace('0.3', '1')}';
          " onmouseout="
            this.style.transform='translateY(0)';
            this.style.boxShadow='inset 2px 2px 4px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(60,60,60,0.1), 0 4px 10px rgba(0,0,0,0.4)';
            this.style.borderColor='${gradientColor.replace('0.3', '0.6')}';
          ">
            <span>▶</span>
            <span>Ver video</span>
          </a>
        </div>

        <!-- Glow LED effect en el borde -->
        <div style="
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 20px;
          background: linear-gradient(135deg, ${gradientColor.replace('0.3', '0.4')}, transparent, ${gradientColor.replace('0.3', '0.4')});
          pointer-events: none;
          opacity: 0.5;
          z-index: -1;
          filter: blur(8px);
        "></div>
      </div>
    </div>
  `;

  const marker = new mapboxgl.Marker(el)
    .setLngLat(loc.coords)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML))
    .addTo(map);

  // Audio en hover del marcador
  hitbox.addEventListener('mouseenter', () => {
    AudioSystem.play('buttonHover');
  });

  // Audio al hacer click en marcador
  hitbox.addEventListener('click', () => {
    AudioSystem.play('markerClick');
    setTimeout(() => {
      AudioSystem.play('popupOpen');
    }, 150);
    marker.togglePopup();
  });

  el.appendChild(hitbox);
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
