document
  .getElementById("btnFiltrar")
  .addEventListener("click", filtrarRegistrosPorFecha);

const MENU = document.querySelector("#menu");
const ROUTER = document.querySelector("#ruteo");
const HOME = document.querySelector("#pantalla-home");
const LOGIN = document.querySelector("#pantalla-login");
const REGISTROU = document.querySelector("#pantalla-registroU");
const REGISTROC = document.querySelector("#pantalla-registroC");
const LISTADO = document.querySelector("#pantalla-listarC");
const INFORME = document.querySelector("#pantalla-informeCalorias");
const URLBASE = "https://calcount.develotion.com/";

let registrosArray = [];
let listaAlimentos = [];

inicio();

function cerrarMenu() {
  MENU.close();
}

function inicio() {
  chequearSession();
  eventos();
  obtenerPaises();
  obtenerAlimentos();
}

function eventos() {
  ROUTER.addEventListener("ionRouteDidChange", navegar);
  document
    .querySelector("#btnHacerLogin")
    .addEventListener("click", previaLogin);
  document
    .querySelector("#btnRegistrarUsuario")
    .addEventListener("click", previaRegistro);
  document
    .querySelector("#btnCerrarSesion")
    .addEventListener("click", cerrarSesion);
  document
    .querySelector("#btnRegistrarC")
    .addEventListener("click", obtenerAlimentos);
  document
    .querySelector("#btnRegistrarAlimento")
    .addEventListener("click", previaRegistroAlimento);
  document
    .querySelector("#btnInformar")
    .addEventListener("click", calcularCalorias);
  document
    .querySelector("#btnInformar")
    .addEventListener("click", obtenerAlimentos);
}

function navegar(evt) {
  ocultarPantallas();
  if (evt.detail.to == "/") HOME.style.display = "block";
  if (evt.detail.to == "/login") LOGIN.style.display = "block";
  if (evt.detail.to == "/registrarU") REGISTROU.style.display = "block";
  if (evt.detail.to == "/registrarC") REGISTROC.style.display = "block";
  if (evt.detail.to == "/listar") {
    LISTADO.style.display = "block";
    obtenerRegistros();
  }
  if (evt.detail.to == "/informeC") INFORME.style.display = "block";
}

function ocultarPantallas() {
  HOME.style.display = "none";
  LOGIN.style.display = "none";
  REGISTROU.style.display = "none";
  REGISTROC.style.display = "none";
  LISTADO.style.display = "none";
  INFORME.style.display = "none";
}

function ocultarBotones() {
  document.querySelector("#btnHome").style.display = "none";
  document.querySelector("#btnLogin").style.display = "none";
  document.querySelector("#btnRegistrarU").style.display = "none";
  document.querySelector("#btnRegistrarC").style.display = "none";
  document.querySelector("#btnListar").style.display = "none";
  document.querySelector("#btnInformar").style.display = "none";
  document.querySelector("#btnMapa").style.display = "none";
  document.querySelector("#btnCerrarSesion").style.display = "none";
}

function chequearSession() {
  if (localStorage.getItem("user") != null) {
    MostrarMenuActivo();
  } else {
    MostrarMenu();
  }
}

function MostrarMenuActivo() {
  ocultarBotones();
  document.querySelector("#btnHome").style.display = "block";
  document.querySelector("#btnRegistrarC").style.display = "block";
  document.querySelector("#btnListar").style.display = "block";
  document.querySelector("#btnInformar").style.display = "block";
  document.querySelector("#btnMapa").style.display = "block";
  document.querySelector("#btnCerrarSesion").style.display = "block";
}

function MostrarMenu() {
  ocultarBotones();
  document.querySelector("#btnLogin").style.display = "block";
  document.querySelector("#btnRegistrarU").style.display = "block";
}

function previaLogin() {
  let usuario = document.querySelector("#txtLoginUsuario").value;
  let password = document.querySelector("#txtPasswordUsuario").value;

  let unUsuario = new Object();
  unUsuario.usuario = usuario;
  unUsuario.password = password;

  hacerLogin(unUsuario);
}

function hacerLogin(unUsuario) {
  fetch(`${URLBASE}login.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(unUsuario),
  })
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      if (data.codigo === 200) {
        document.getElementById("mensajeLoginExitoso").innerText =
          "Login exitoso!";
        localStorage.setItem("idUsuario", data.id);
        localStorage.setItem("apikey", data.apiKey);
        localStorage.setItem("caloriasDiarias", data.caloriasDiarias);
        ocultarPantallas();
        HOME.style.display = "block";
        MostrarMenuActivo();
        document.querySelector("#pantalla-home ion-title").innerText =
          "Bienvenido " + unUsuario.usuario;
        setTimeout(function () {
          document.getElementById("mensajeLoginExitoso").innerText = "";
        }, 4000);
      } else {
        document.getElementById("mensajeError").innerText = data.mensaje;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function previaRegistro() {
  let usuario = document.querySelector("#txtRegistroUsuario").value;
  let password = document.querySelector("#txtRegistroPassword").value;
  let idPais = document.querySelector("#txtRegistroPais").value;
  let caloriasDiarias = document.querySelector("#txtRegistroCalorias").value;

  let nuevoUsuario = new Object();
  nuevoUsuario.usuario = usuario;
  nuevoUsuario.password = password;
  nuevoUsuario.idPais = idPais;
  nuevoUsuario.caloriasDiarias = caloriasDiarias;

  hacerRegistro(nuevoUsuario);
}

function hacerRegistro(nuevoUsuario) {
  fetch(`${URLBASE}usuarios.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevoUsuario),
  })
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      if (data.codigo === 200) {
        document.getElementById("mensajeRegistroExitoso").innerText =
          "Registro exitoso!";
        document.getElementById("mensajeErrorRegistro").innerText = "";
        limpiarCamposRegistro();
      } else {
        document.getElementById("mensajeErrorRegistro").innerText =
          data.mensaje;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function limpiarCamposRegistro() {
  document.querySelector("#txtRegistroUsuario").value = "";
  document.querySelector("#txtRegistroPassword").value = "";
  document.querySelector("#txtRegistroPais").value = "";
  document.querySelector("#txtRegistroCalorias").value = "";
}

function limpiarCamposRegistroAlimento() {
  document.querySelector("#txtIdAlimento").value = "";
  document.querySelector("#txtCantidadAlimento").value = "";
  document.querySelector("#txtFechaAlimento").value = "";
}

function cerrarSesion() {
  localStorage.clear();
  window.location.reload();
  ROUTER.push("/login");
}

function obtenerPaises() {
  fetch(`${URLBASE}paises.php`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (respuesta) {
      console.log(respuesta);
      if (respuesta && respuesta.paises) {
        const selectPais = document.getElementById("txtRegistroPais");
        respuesta.paises.forEach(function (pais) {
          const option = document.createElement("ion-select-option");
          option.value = pais.id;
          option.textContent = pais.name;
          selectPais.appendChild(option);
        });
      } else {
        console.error("Error al obtener los países: Datos incompletos");
      }
    })
    .catch(function (error) {
      console.error("Error al obtener los países:", error);
    });
}

function obtenerAlimentos() {
  if (listaAlimentos.length === 0) {
    apiKey = localStorage.getItem("apikey");
    idUser = localStorage.getItem("idUsuario");

    fetch(`${URLBASE}alimentos.php`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        iduser: idUser,
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (respuesta) {
        if (respuesta && respuesta.alimentos) {
          const selectAlimento = document.getElementById("txtIdAlimento");
          respuesta.alimentos.forEach(function (alimento) {
            const option = document.createElement("ion-select-option");
            option.value = alimento.id;
            option.textContent = alimento.nombre;
            selectAlimento.appendChild(option);
          });
          listaAlimentos = respuesta.alimentos;
          console.log(listaAlimentos);
        } else {
          console.error("Error al obtener los alimentos");
        }
      })
      .catch(function (error) {
        console.error("Error al obtener los alimentos:", error);
      });
  }
}

function previaRegistroAlimento() {
  let idUsuario = localStorage.getItem("idUsuario");
  let id = document.querySelector("#txtIdAlimento").value;
  let cantidad = document.querySelector("#txtCantidadAlimento").value;
  let fecha = document.querySelector("#txtFechaAlimento").value;

  let nuevoAlimentoRegistrado = new Object();
  nuevoAlimentoRegistrado.idAlimento = id;
  nuevoAlimentoRegistrado.idUsuario = idUsuario;
  nuevoAlimentoRegistrado.cantidad = cantidad;
  nuevoAlimentoRegistrado.fecha = fecha;

  hacerRegistroAlimento(nuevoAlimentoRegistrado);
}

function hacerRegistroAlimento(nuevoAlimentoRegistrado) {
  apiKey = localStorage.getItem("apikey");
  idUser = localStorage.getItem("idUsuario");

  fetch(`${URLBASE}registros.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: apiKey,
      iduser: idUser,
    },
    body: JSON.stringify(nuevoAlimentoRegistrado),
  })
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      if (data.codigo === 200) {
        localStorage.setItem("idRegistro", data.idRegistro);
        document.getElementById("mensajeRegistroAlimentoExitoso").innerText =
          "Registro exitoso!";
        document.getElementById("mensajeErrorAlimentoRegistro").innerText = "";
        limpiarCamposRegistroAlimento();
      } else {
        document.getElementById("mensajeErrorAlimentoRegistro").innerText =
          data.mensaje;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function obtenerRegistros() {
  const apiKey = localStorage.getItem("apikey");
  const idUsuario = localStorage.getItem("idUsuario");

  fetch(`${URLBASE}registros.php?idUsuario=${idUsuario}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: apiKey,
      iduser: idUsuario,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      if (data && data.registros) {
        registrosArray = data.registros;
        mostrarRegistros(registrosArray);
        console.log(registrosArray);
      } else {
        console.error("Error al obtener los registros");
      }
    })
    .catch(function (error) {
      console.error("Error al obtener los registros:", error);
    });
}

function mostrarRegistros(registros) {
  const listaComidas = document.getElementById("lista-comidas");
  listaComidas.innerHTML = "";

  if (registros.length === 0) {
    document.getElementById("mensajeSinRegistros").style.display = "block";
    return;
  } else {
    document.getElementById("mensajeSinRegistros").style.display = "none";
  }

  registros.forEach(function (registro) {
    const item = document.createElement("ion-item");

    let alimentoEncontrado = null;
    for (let i = 0; i < listaAlimentos.length; i++) {
      if (listaAlimentos[i].id === registro.idAlimento) {
        alimentoEncontrado = listaAlimentos[i];
        break;
      }
    }

    if (alimentoEncontrado) {
      const imagen = document.createElement("ion-img");
      imagen.src = `${URLBASE}imgs/${alimentoEncontrado.imagen}.png`;
      imagen.slot = "start";
      item.appendChild(imagen);

      const texto = document.createElement("ion-label");
      texto.textContent = `${alimentoEncontrado.nombre} - ${alimentoEncontrado.calorias} calorías`;
      item.appendChild(texto);
    } else {
      console.error(`No se encontró el alimento con id ${registro.idAlimento}`);
    }

    const botonEliminar = document.createElement("ion-button");
    botonEliminar.slot = "end";
    botonEliminar.textContent = "Eliminar";
    botonEliminar.addEventListener("click", function () {
      eliminarRegistro(registro.id);
    });
    item.appendChild(botonEliminar);
    listaComidas.appendChild(item);
  });
}

function eliminarRegistro(idRegistro) {
  const apiKey = localStorage.getItem("apikey");
  const idUsuario = localStorage.getItem("idUsuario");

  fetch(`${URLBASE}registros.php?idRegistro=${idRegistro}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      apikey: apiKey,
      iduser: idUsuario,
    },
  })
    .then(function (response) {
      if (response.ok) {
        console.log("Registro eliminado correctamente");
        mostrarMensajeTemporal("Registro eliminado con éxito", "red");
        obtenerRegistros();
      } else {
        console.error("Error al eliminar el registro");
      }
    })
    .catch(function (error) {
      console.error("Error al eliminar el registro:", error);
    });
}

function mostrarMensajeTemporal(mensaje, color) {
  const mensajeElemento = document.createElement("div");
  mensajeElemento.textContent = mensaje;
  mensajeElemento.classList.add("mensaje-temporal");
  mensajeElemento.style.backgroundColor = color;

  document.body.appendChild(mensajeElemento);

  setTimeout(function () {
    mensajeElemento.classList.add("mostrar");
  }, 100);

  setTimeout(function () {
    mensajeElemento.classList.remove("mostrar");
    setTimeout(function () {
      document.body.removeChild(mensajeElemento);
    }, 300);
  }, 2000);
}

function filtrarRegistrosPorFecha() {
  const fechaInicio = new Date(document.getElementById("fechaInicio").value);
  const fechaFin = new Date(document.getElementById("fechaFin").value);

  const registrosFiltrados = [];

  for (let i = 0; i < registrosArray.length; i++) {
    const fechaRegistro = new Date(registrosArray[i].fecha);
    if (fechaRegistro >= fechaInicio && fechaRegistro <= fechaFin) {
      registrosFiltrados.push(registrosArray[i]);
    }
  }

  mostrarRegistros(registrosFiltrados);
}

function calcularCalorias() {
  let totalCalorias = 0;
  let caloriasHoy = 0;
  const hoy = new Date().toISOString().split("T")[0];

  for (let i = 0; i < registrosArray.length; i++) {
    for (let j = 0; j < listaAlimentos.length; j++) {
      if (registrosArray[i].idAlimento === listaAlimentos[j].id) {
        const cantidad = registrosArray[i].cantidad;
        const caloriasPorAlimento = listaAlimentos[j].calorias * cantidad;
        totalCalorias += caloriasPorAlimento;

        if (registrosArray[i].fecha === hoy) {
          caloriasHoy += caloriasPorAlimento;
        }
        break;
      }
    }
  }

  document.getElementById("totalCalorias").textContent = totalCalorias;
  document.getElementById("caloriasDiarias").textContent = caloriasHoy;

  const caloriasDiariasPrevistas = parseInt(
    localStorage.getItem("caloriasDiarias")
  );

  const porcentaje = (caloriasHoy / caloriasDiariasPrevistas) * 100;
  let colorTexto = "";
  if (porcentaje > 100) {
    colorTexto = "red";
  } else if (porcentaje >= 90 && porcentaje <= 100) {
    colorTexto = "orange";
  } else {
    colorTexto = "green";
  }

  document.getElementById("caloriasDiarias").style.color = colorTexto;
}
