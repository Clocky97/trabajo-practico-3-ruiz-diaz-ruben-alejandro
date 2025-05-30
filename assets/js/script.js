const URL_DBZ = "https://dragonball-api.com/api/characters";
let todosLosPersonajes = [];
let paginaActual = 1;
let cargando = false;
const inputBusqueda = document.getElementById("searchInput");
const botonBuscar = document.getElementById("searchButton");
const contenedorResultados = document.getElementById("results");
const contenedorMensaje = document.getElementById("message");
botonBuscar.addEventListener("click", () => {
  const nombre = inputBusqueda.value.trim();
  if (!nombre) {
    mostrarMensaje("Pero busca algo, GIL.");
    return;
  }
  buscarPersonajes(nombre);
});

async function buscarPersonajes(nombre) {
  limpiarResultados();
  mostrarMensaje("Buscando...");
  try {
    const respuesta = await fetch(`${URL_DBZ}?name=${nombre}`);
    if (!respuesta.ok) throw new Error("No se pudo conectar con la API");

    const datos = await respuesta.json();
    console.log(datos)

    if (datos.length == 0) {
      mostrarMensaje("Nada con ese nombre");
      return;
    }

    mostrarPersonajes(datos);
    mostrarMensaje("");
  } catch (error) {
    mostrarMensaje("Hubo un problema al buscar");
    console.error(error);
  }
}
function mostrarPersonajes(listaPersonajes, append = false) {
  listaPersonajes.forEach((personaje) => {
    const columna = document.createElement("div");
    columna.className = "col-md-4";

    const tarjeta = document.createElement("div");
    tarjeta.className = "card";

    const imagen = document.createElement("img");
    imagen.src = personaje.image;
    imagen.alt = personaje.name;
    imagen.className = "main-card";

    const cuerpo = document.createElement("div");
    cuerpo.className = "card-body";

    cuerpo.innerHTML = `
      <h5 class="card-title">${personaje.name}</h5>
      <p class="card-text"><strong>Raza:</strong> ${personaje.race || "No se sabe"}</p>
      <p class="card-text"><strong>Género:</strong> ${personaje.gender || "Sin informacion"}</p>
    `;

    tarjeta.appendChild(imagen);
    tarjeta.appendChild(cuerpo);
    columna.appendChild(tarjeta);
    contenedorResultados.appendChild(columna);
  });
}
function mostrarMensaje(texto) {
  contenedorMensaje.textContent = texto;
}

function limpiarResultados() {
  contenedorResultados.innerHTML = "";
  contenedorMensaje.textContent = "";
}

window.addEventListener("scroll", () => {
  const distanciaPagina = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
  if (distanciaPagina && !cargando) {
    cargarPersonajes(paginaActual);
  }
});

async function cargarPersonajes(pagina = 1) {
  if (cargando) return;
  cargando = true;
  mostrarCargando(true);
  try {
    const respuesta = await fetch(`${URL_DBZ}?page=${pagina}`);
    const datos = await respuesta.json();

    if (!datos.items || datos.items.length === 0 || datos.error) {
      mostrarMensaje("No hay más personajes");
      return;
    }

    mostrarPersonajes(datos.items, pagina > 1);
    paginaActual++;
  } catch (error) {
    console.error(error);
    mostrarMensaje("Error al cargar los personajes");
  } finally {
    mostrarCargando(false);
    cargando = false;
  }
}
function mostrarCargando(mostrar) {
  document.getElementById("loader").style.display = mostrar ? "block" : "none";
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const respuesta = await fetch(`${URL_DBZ}`);
    if (!respuesta.ok) throw new Error("No se pudo conectar con la API");

    const datos = await respuesta.json();

    if (datos.items.length === 0) {
      mostrarMensaje("Nada con ese nombre");
      return;
    }

    console.log(datos)

    datos.items.forEach((personaje) => {
      const columna = document.createElement("div");
      columna.className = "col-md-4";

      const tarjeta = document.createElement("div");
      tarjeta.className = "card";

      const imagen = document.createElement("img");
      imagen.src = personaje.image;
      imagen.alt = personaje.name;
      imagen.className = "main-card";

      const cuerpo = document.createElement("div");
      cuerpo.className = "card-body";

      cuerpo.innerHTML = `
      <h5 class="card-title">${personaje.name}</h5>
      <p class="card-text"><strong>Raza:</strong> ${personaje.race || "No se sabe"}</p>
      <p class="card-text"><strong>Género:</strong> ${personaje.gender || "Sin informacion"}</p>
    `;

      tarjeta.appendChild(imagen);
      tarjeta.appendChild(cuerpo);
      columna.appendChild(tarjeta);
      contenedorResultados.appendChild(columna);
    });

  } catch (error) {
    mostrarMensaje("Hubo un problema al buscar");
    console.error(error);
  }
})