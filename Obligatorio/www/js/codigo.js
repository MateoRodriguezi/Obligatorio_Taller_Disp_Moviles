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
}

function eventos() {
  ROUTER.addEventListener("ionRouteDidChange", navegar);
  document
    .querySelector("#btnHacerLogin")
    .addEventListener("click", previaLogin);
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
        alert("¡Login exitoso!");
        localStorage.setItem("idUsuario", data.id);
        localStorage.setItem("apikey", data.apiKey);
        ocultarPantallas();
        HOME.style.display = "block";
        MostrarMenuActivo();
      } else {
        alert(data.mensaje);
      }
    })
    .catch(function (error) {
      console.log(error);
      alert("Error en la solicitud al servidor");
    });
}
