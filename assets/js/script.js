const URL_API = "https://dragonball-api.com/api/characters";

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
    const respuesta = await fetch(`${URL_API}?name=${nombre}`);
    if (!respuesta.ok) throw new Error("No se pudo conectar con la API");

    const datos = await respuesta.json();

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

function mostrarPersonajes(listaPersonajes) {
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
      <p class="card-text"><strong>Género:</strong> ${personaje.gender || "Sin infor"}</p>
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