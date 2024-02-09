const MENU = document.querySelector("#menu");
const ROUTER = document.querySelector("#ruteo");
const HOME = document.querySelector("#pantalla-home");
const LOGIN = document.querySelector("#pantalla-login");
const REGISTROU = document.querySelector("#pantalla-registroU");
const REGISTROC = document.querySelector("#pantalla-registroC");
const URLBASE = "https://calcount.develotion.com/";

inicio();

function cerrarMenu() {
  MENU.close();
}

function inicio() {
  chequearSession();
  eventos();
  obtenerPaises();
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
}

function navegar(evt) {
  ocultarPantallas();
  if (evt.detail.to == "/") HOME.style.display = "block";
  if (evt.detail.to == "/login") LOGIN.style.display = "block";
  if (evt.detail.to == "/registrarU") REGISTROU.style.display = "block";
  if (evt.detail.to == "/registrarC") REGISTROC.style.display = "block";
}

function ocultarPantallas() {
  HOME.style.display = "none";
  LOGIN.style.display = "none";
  REGISTROU.style.display = "none";
  REGISTROC.style.display = "none";
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
      } else {
        console.error("Error al obtener los alimentos");
      }
    })
    .catch(function (error) {
      console.error("Error al obtener los alimentos:", error);
    });
}

function previaRegistroAlimento() {
  let idUser = localStorage.getItem("idUsuario");
  let id = document.querySelector("#txtIdAlimento").value;
  let cantidad = document.querySelector("#txtCantidadAlimento").value;
  let fecha = document.querySelector("#txtFechaAlimento").value;

  let nuevoAlimentoRegistrado = new Object();
  nuevoAlimentoRegistrado.id = id;
  nuevoAlimentoRegistrado.idUser = idUser;
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
