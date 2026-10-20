// — Selector de elementos del DOM
const selector = document.getElementById('selectorCiudad');
const boton = document.getElementById('btnConsultar');
const resultado = document.getElementById('resultado');
const mensajeError = document.getElementById('mensajeError');

// — Coordenadas de cada ciudad
const CIUDADES = {
  lima: { lat: -12.04, lon: -77.03, nombre: 'Lima' },
  cusco: { lat: -13.53, lon: -71.97, nombre: 'Cusco' },
  arequipa: { lat: -16.41, lon: -71.54, nombre: 'Arequipa' },
  trujillo: { lat: -8.11, lon: -79.03, nombre: 'Trujillo' },
  piura: { lat: -5.19, lon: -80.63, nombre: 'Piura' },
  iquitos: { lat: -3.75, lon: -73.25, nombre: 'Iquitos' },
  puno: { lat: -15.84, lon: -70.02, nombre: 'Puno' },
  huancayo: { lat: -12.07, lon: -75.21, nombre: 'Huancayo' },
};

// — URL base de la API
const URL_BASE = 'https://api.open-meteo.com/v1/forecast';

// — Función principal
async function consultarClima() {

  // 1. Obtenemos la ciudad seleccionada por el usuario
  const clave = selector.value; // valor del <select>
  const ciudad = CIUDADES[clave]; // objeto con lat, lon y nombre

  ocultarError();
  resultado.innerHTML = '<p>Cargando...</p>';

  try {
    // 2. Construimos la URL con las coordenadas de la ciudad elegida
    const url = `${URL_BASE}?latitude=${ciudad.lat}&longitude=${ciudad.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=America/Lima`;

    // 3. Realizamos la petición y esperamos la respuesta
    const response = await fetch(url);

    // 4. Verificamos que la petición fue exitosa
    if (!response.ok) {
      throw new Error(`Error al conectar con la API (${response.status})`);
    }

    // 5. Convertimos la respuesta a objeto JavaScript
    const data = await response.json();

    // 6. Enviamos los datos al renderizador
    renderizarClima(data, ciudad.nombre);

  } catch (error) {
    resultado.innerHTML = '';
    mostrarError('⚠️ ' + error.message);
  }
}

// — Helpers
function mostrarError(msg) {
  mensajeError.textContent = msg;
  mensajeError.style.display = 'block';
}

function ocultarError() {
  mensajeError.textContent = '';
  mensajeError.style.display = 'none';
}

// — Renderizado dinámico con template literals
function renderizarClima(data, nombreCiudad) {

  // Extraemos los campos del JSON
  const temperatura = data.current.temperature_2m; // temperatura en °C
  const humedad = data.current.relative_humidity_2m; // humedad en %
  const viento = data.current.wind_speed_10m; // velocidad del viento
  const altitud = data.elevation; // elevación en metros
  const hora = data.current.time.slice(11, 16); // solo HH:MM

  // Template literal: construimos el HTML completo de la tarjeta
  const html = `
    <article class="tarjeta-clima">
      <h2>${nombreCiudad}</h2>
      <p class="altitud">📍 ${altitud} m.s.n.m.</p>

      <p class="temperatura">${temperatura}°C</p>

      <div class="detalles">
        <div class="detalle-item">
          <span class="etiqueta">Humedad</span>
          <span class="valor">${humedad}%</span>
        </div>
        <div class="detalle-item">
          <span class="etiqueta">Viento</span>
          <span class="valor">${viento} km/h</span>
        </div>
        <div class="detalle-item">
          <span class="etiqueta">Actualizado</span>
          <span class="valor">${hora}</span>
        </div>
      </div>
    </article>
  `;

  // Inyectamos el HTML en el DOM
  resultado.innerHTML = html;
}

// — Eventos
boton.addEventListener('click', consultarClima);