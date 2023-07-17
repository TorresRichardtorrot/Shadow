// selectores
const facturaContainer = document.querySelector('.box-factura');
const containerF = document.querySelector('.container-factura');
const correo = localStorage.getItem('email');
const color = localStorage.getItem('Tema');
const divStrong = document.querySelector('#memorias')
const strongElements = divStrong.querySelectorAll('strong'); 
const inputDolar = document.querySelector('#dolar_input')

const enviarPassword = document.querySelector('.enviar_password')
const contenedorDelPassword = document.querySelector('#password_Admin')
const contenedorCarrito = document.querySelector('#lista-carrito tbody'); 
const listaItems = document.querySelector('#lista-items');
const menuCarrito = document.querySelector('#carrito');
var articulosCarrito = [];

const reproductorC = document.querySelector('#reproductor')

const inputBuscador = document.getElementById("input-buscador");
const pantalla = document.querySelector(".pantalla");
const ventana = document.getElementById("ventana-Calculadora");


// selector botones
const btnR = document.querySelector('#btn-reproductor')
const vaciarCarritoBtn = document.querySelector('#vaciar-compras');
const btnmicrofono = document.getElementById('boton_microfono');
const btnFacturar = document.querySelector('#facturar-btn');
const botonCalculadodara = document.getElementById("btn-calculadora");
const botones = document.querySelectorAll(".btn");
const bodyColor = document.querySelector('#color_body');
var bodyC = document.querySelector('.padre')
const btnChecked = document.querySelector('#checkPassword')

var offsetX = 0;
var offsetY = 0;
var dragging = false;
var ejex = 0;
var ejey = 0;


var moviendo = false;
const ruta = "/shadowsell";



if(color){
  console.log(color)
  bodyC.style.background=color
  
}
  

//funciones
validarModo();
async function validarModo() {
  const correo = localStorage.getItem('email');
  if(correo){
      try {
          const response = await fetch(`${ruta}/usersModo/${correo}`);
          const data = await response.json();
          const mensage = data.message;

            // console.log(data)

          if (mensage === true) {

            // console.log(`El campo activo es true`);
                const loading = document.querySelector(".lds-ring");
                loading.classList.add("hidden");
            setTimeout(() => {
                
                loading.style.display="none";
              }, 2000);
          } else {
            window.location.href ="http://localhost:3000/"
          }
        } catch (error) {
          console.error('Ocurrió un error al validar el campo activo:', error);
          window.location.href ="http://localhost:3000/"
        }
  }else{
      window.location.href ="http://localhost:3000/"
  }
  
}

//esta funcion me permite llamar a la base de datos para obtener el numero de facturas generadas
llamarApiVentas()
async function llamarApiVentas() {
  try {
    const response = await fetch(`${ruta}/ventasF/${correo}`);
    if (response.ok) {
      const data = await response.json();
      
      
      
      const dato = data.length + 1;
      crearNumeroF(dato)
    } else {
      console.log('Error en la respuesta de la API');
    }
  } catch (error) {
    console.log('Error al realizar la solicitud:', error);
  }
}
//aqui agrego el numero de facturas a mi documento
function crearNumeroF(dato){

  const valorF = document.querySelector('#factura')
  valorF.innerHTML=`00-000000${dato}`;

}

Dolartoday()

//Conexion con el api de Dolar
async function Dolartoday(){

  var myHeaders = new Headers();
  myHeaders.append("apikey", "ROC6M4nfgFF71eAdwnOvAJtbLQbTm4IF");

var valor1 ="VES" 
var valor2 = "USD"
var requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};

  var myHeaders = new Headers();
  myHeaders.append("apikey", "ROC6M4nfgFF71eAdwnOvAJtbLQbTm4IF");

  await fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${valor1}&from=${valor2}&amount=1`, requestOptions)
  .then(response => response.json())

  .then(result => crearTaza(result.result))

  .catch(error => console.log('error', error))
}
  
function crearTaza(resultado){
  inputDolar.innerText=resultado.toFixed(2);
}


  // cambia el contenido del la taza del dia
  function cambiarContenido() {
    const strongElement = document.getElementById("dolar_input");
    const contenidoAnterior = strongElement.innerText;
  
    // Crear un nuevo elemento input
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.value = contenidoAnterior;
  
    // Reemplazar el strong por el input
    strongElement.parentNode.replaceChild(inputElement, strongElement);
  
    // Hacer foco en el input
    inputElement.focus();
  
    // Actualizar el valor y volver a convertirlo en strong al presionar Enter
    inputElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
  
        // Actualizar el contenido del strong
        const nuevoContenido = inputElement.value;
        const nuevoStrongElement = document.createElement("strong");
        nuevoStrongElement.id ="dolar_input"
        nuevoStrongElement.innerHTML = nuevoContenido;
  
        // Reemplazar el input por el strong
        inputElement.parentNode.replaceChild(nuevoStrongElement, inputElement);
        totalAPagar()
      }
    });
  }
  
  // funcion para editar la cantidad de los articulos en la tabla
  function enableEditing() {
    const tdCList = document.querySelectorAll('.tdC');
  let selectedTd = null;

    tdCList.forEach((tdC) => {
      tdC.addEventListener('click', () => {
        if (selectedTd) {
          selectedTd.removeAttribute('contenteditable');
          selectedTd.classList.remove('selected');
          actualizarPrecioT();
          
        }
        selectedTd = tdC;
        selectedTd.setAttribute('contenteditable', 'true');
        selectedTd.focus();
        selectedTd.classList.add('selected');
      });
    });
  
  
    document.addEventListener('keydown', (event) => {
      if (selectedTd && event.key === 'Enter') {
        event.preventDefault();
        const newValue = parseFloat(selectedTd.innerText.trim());

       if (!isNaN(newValue) || newValue === 0) {
       selectedTd.innerText = newValue !== 0 ? newValue : '1';
      } else {
       selectedTd.innerText = '1';
      }

        selectedTd.removeAttribute('contenteditable');
        selectedTd.classList.remove('selected');
        selectedTd = null;
        actualizarPrecioT()
      }
    });
    

  }

  //funcion para para regresar despues de crear el contenedor de factura
  function atrasFactura(){
    facturaContainer.innerHTML=""
    containerF.style.display="none"
  }

  //multiplica la cantidad por el precio para obtener el total
  function actualizarPrecioT() {
    const trHoverList = document.querySelectorAll('tr.hover');
  
    trHoverList.forEach((trHover) => {
      const tdC = trHover.querySelector('.tdC');
      const precioU = trHover.querySelector('.precio-U');
      const precioTotal = trHover.querySelector('.precio-total');
  
      if (tdC && precioU && precioTotal) {
        const valor1 = parseFloat(tdC.innerText.trim());
        const valor2 = parseFloat(precioU.innerText.trim());
  
        if (!isNaN(valor1) && !isNaN(valor2)) {
          const result = valor1 * valor2;
          precioTotal.innerText = result.toFixed(2);
        }
      }
    });
    totalAPagar()
  }
  //Funcion para la hora 
  function mostrarHoraLocal() {
      
      const fechaHoraActual = new Date();
    
      const horaLocal = fechaHoraActual.getHours();
      const minutosLocal = fechaHoraActual.getMinutes();
      
      const dia = fechaHoraActual.getDate();
      const mes = fechaHoraActual.getMonth() + 1; 
      const año = fechaHoraActual.getFullYear();
    
      const horaFormateada = `  ${horaLocal.toString().padStart(2, '0')}:${minutosLocal.toString().padStart(2, '0')}`;
      const fechaFormateada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${año}`;

      // Actualiza el contenido del div
      const divHora = document.getElementById('pDeHora');
      const divFecha = document.getElementById('pDeFecha');
      const divFecha2 = document.getElementById('pDeFecha2');

      divFecha.innerHTML = fechaFormateada;
      divFecha2.innerHTML = fechaFormateada;
      divHora.innerHTML = horaFormateada;
    }
    
    // Actualiza la hora local cada segundo 
    setInterval(mostrarHoraLocal, 1000);

    //Pantalla completa ** falta crear evento **
function toggleFullScreen() {
  const element = document.getElementById("bodyC");
  if (!document.fullscreenElement && !document.mozFullScreenElement &&
      !document.webkitFullscreenElement && !document.msFullscreenElement) {
      // Entrar en modo pantalla completa
      if (element.requestFullscreen) {
          element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) { 
          element.webkitRequestFullscreen();
      } 
  } else {
      // Salir del modo pantalla completa
       if (document.webkitExitFullscreen) { 
          document.webkitExitFullscreen();
      } 
  }
}

//funcion para agregar los articulos seleccionados a la tabla

function agregarArticulo(e){
    //agrega el articulo al carrito
    e.preventDefault();
    
    if(e.target.classList.contains('agregar-carrito')){
        // console.log("haciendo click en el boton")
       
        const articulo = e.target.parentElement.parentElement;
        

        leerDatosArticulos(articulo);
        enableEditing()
        totalAPagar()
       

    }
}

// leer los datos que vamos a mostrar en la tabla
function leerDatosArticulos(articulo){
    const infoArticulos = {
        
        titulo: articulo.querySelector('.nombre').textContent,
        precio: articulo.querySelector('.precio').textContent,
        id: articulo.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }  
if(articulosCarrito.some(articulo => articulo.id === infoArticulos.id)){
    //existe el articulo? 
    const articulos = articulosCarrito.map(articulo => {
        if(articulo.id ===infoArticulos.id){
            articulo.cantidad ++;
            
            return articulo;
        }else{
            return articulo;
        }

    })

    articulosCarrito = [...articulos];
}else{ 
    articulosCarrito = [...articulosCarrito, infoArticulos]
}
    carritoHTML();
}
 
// crea una tabla con los datos que le proporciono la funcion leerDatos
function carritoHTML() {
  vaciarCarrito();

  articulosCarrito.forEach((articulo) => {
    const row = document.createElement('tr');
    row.id=articulo.id
    row.classList.add('h');
    let totalP = articulo.precio * articulo.cantidad;

    row.innerHTML = `
      <td class="tdC" id="td_cantidad">${articulo.cantidad}</td>
      <td id="nombre">${articulo.titulo}</td>
      <td class="precio-U">${articulo.precio}</td>
      <td class="precio-total">${totalP.toFixed(2)}</td>
      <td>
        <button class="eliminar-articulo" data-id="${articulo.id}">Eliminar</button>
      </td>
    `;

    contenedorCarrito.appendChild(row);
    seleccionFila();
    
const btnEliminar = document.querySelector('.eliminar-articulo');

// Agregar event listener al botón de eliminar
btnEliminar.addEventListener('click', function() {
  const elementoHover = document.querySelector('tr.hover');
  if (elementoHover) {
    elementoHover.remove();
  }
});
  });

  // Agregar eventos de eliminación a los botones "Eliminar"
  const btnsEliminar = document.querySelectorAll('.eliminar-articulo');
  btnsEliminar.forEach((btn) => {
    btn.addEventListener('click', eliminarArticulo);
  });
}

// eliminar articulo
function eliminarArticulo(event) {
  const btnEliminar = event.target;
  const idArticulo = btnEliminar.getAttribute('data-id');

  articulosCarrito = articulosCarrito.filter((articulo) => articulo.id !== idArticulo);
  carritoHTML();
  totalAPagar()
}

// Vaciar por completo la tabla de articulos
function vaciarCarrito(){

while(contenedorCarrito.firstChild){
    contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    totalAPagar()
}

}

// funcion que crea la tabla de la factura extralledo los datos de la tabla de articulos

function generarFactura() {
  if (articulosCarrito.length === 0) {
    // ***Aquí voy a poner una alerta***
    alert("El carrito está vacío. No se puede generar la factura.");
    return;
  }

  const tbody = document.querySelector('#tabla_one');
const trList = tbody.querySelectorAll('tr');

const tablaTr = [];

trList.forEach((tr) => {

  const id =tr.getAttribute('id');
  const trS = document.createElement('tr');
  trS.setAttribute('id',id)
  
  const tdCantidad = tr.querySelector('#td_cantidad').innerText;
  const nombre = tr.querySelector('#nombre').innerText;
  const precioU = tr.querySelector('.precio-U').innerText;
  const precioTotal = tr.querySelector('.precio-total').innerText;
  

  trS.innerHTML += `
    <td class="tdC">${tdCantidad}</td>
    <td>${nombre}</td>
    <td class="centrar precio-U">${precioU}</td>
    <td class="centrar precio-total">${precioTotal}</td>
  `;

  tablaTr.push(trS);
});

const factura = document.createElement('div');
factura.classList.add("box-tabla");

factura.innerHTML = `
  <table class="tabla tabla2">
    <thead>
      <tr>
        <th>Cantidad</th>
        <th>Artículos</th>
        <th>Precio</th>
        <th class="th-total">Total</th>
      </tr>
    </thead>
    <tbody class="contenedor2">
      ${tablaTr.map(tr => tr.outerHTML).join('')}
    </tbody>
  </table>
`;

      // console.log(factura.innerHTML);
      // console.log(factura)
        
  facturaContainer.appendChild(factura);
  
  containerF.style.display = 'flex';

  seleccionFila();
  // Aquí voy a manipular factura para hacer otras funciones
  // console.log(factura); 
}

function playMusic() {
     
  const clientId = '4414081513f844b2adf108ebbbc499b5'; 
  const clientSecret = '64e26121b4034963b7bfdf132e52fa50';
  const tokenEndpoint = 'https://accounts.spotify.com/api/token';
  const authOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: 'grant_type=client_credentials'
  };

  fetch(tokenEndpoint, authOptions)
    .then(response => response.json())
    .then(data => {
      const accessToken = data.access_token; 

      const apiEndpoint = 'https://api.spotify.com/v1/'; 
      const searchQuery = 'q=artist:Bad%20bunny&type=track';
      const apiOptions = {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      };
      fetch(apiEndpoint + 'search?' + searchQuery, apiOptions)
        .then(response => response.json())
        .then(data => {

          console.log(data);

          const tracks = data.tracks.items; 

          let currentIndex = 0; 

          const playNextTrack = () => {
            currentIndex++;

            if (currentIndex >= tracks.length) {
              currentIndex = 0;
            }
            const nextTrack = tracks[currentIndex];
            const previewUrl = nextTrack.preview_url;
            const trackName = nextTrack.name;

            const reproductor = document.querySelector('#musica2');

            reproductor.src = previewUrl;
            reproductor.play();

            console.log('Reproduciendo:', trackName);
            console.log('URL de reproducción:', previewUrl);
          };

          const reproductor = document.querySelector('#musica2');
          reproductor.addEventListener('ended', playNextTrack);

          const firstTrack = tracks[0];
          const previewUrl = firstTrack.preview_url; 
          const trackName = firstTrack.name; 
          reproductor.src = previewUrl;
          reproductor.play();
          console.log('Reproduciendo:', trackName);
          console.log('URL de reproducción:', previewUrl);

        })
        .catch(error => {
         
          console.log('Error:', error);
        });
    })
    .catch(error => {
     
      console.log('Error:', error);
    });
}


  //   **** Muy importante seleccion en tablas ****
// funcion para seleccionar tr de las tablas 
  //hover de las filas

  function seleccionFila() {
    const filas = document.querySelectorAll('.tabla tr');
    const cambiar = document.querySelector('.cfb')
    cambiar.style.opacity = "1";
    function handleClick(e) {
      const target = e.target;

      if (target.tagName === 'TD' && target.parentElement.tagName === 'TR') {
        
        filas.forEach((fila) => {
          fila.classList.remove('hover');
        });
        target.parentElement.classList.add('hover');
      } else {
        
        filas.forEach((fila) => {
          fila.classList.remove('hover');
        });
      }
    }
    filas.forEach((fila) => {
      fila.addEventListener('click', handleClick);
    });
    document.addEventListener('click', function(event) {
      const target = event.target;
      if (!target.closest('.tabla tr')) {
        
        filas.forEach((fila) => {
          fila.classList.remove('hover');
        });
      }
    });
  }

  // una funcion para cargar unos eventos
function cargarEventListeners() {
  //captura un evento cuando hacemos click en el boton "Agregar"
  listaItems.addEventListener('click', agregarArticulo);
  // vaciar carrito
  vaciarCarritoBtn.addEventListener('click', () => {
    articulosCarrito = [];
    vaciarCarrito();
  });
}

// crea los contenedores de los productos con los dato obtenido de la base de datos 
function crearProducto(nameP, categoria, precioP, id) {

  const divProductos = document.createElement('div');
  divProductos.dataset.info1 = nameP;
  divProductos.dataset.info2 = categoria;
  divProductos.classList.add('card');
  divProductos.innerHTML = `
  <div class="card_header">
  <div class="tittle">
      <div class="circle"></div>
      <p>${categoria}</p>
  </div>
  <div class="id">
      <p class="precio">${precioP.toFixed(2)}</p><span class="color_green">$</span>
  </div>
</div>
<div class="card_section">
  <p class="nombre">${nameP}</p>
</div>
<div class="card_footer">
<a href="#" title="Agregar" class="agregar-carrito" data-id="${id}">Agregar</a></a>
</div>
    
  `;
  listaItems.appendChild(divProductos);
}

// boton de admin
function redirigirAPagina() {

  if(contenedorDelPassword.style.display === "none"){
    contenedorDelPassword.style.display="block"
  }else if(contenedorDelPassword.style.display ==="block"){
    contenedorDelPassword.style.display="none"
  }
}



// suma todos los totales de la tabla de los articulos para introducirlo en el container de total a pagar
function totalAPagar() {
  const totales = document.querySelectorAll('.precio-total');
  const valoresTotales =[];

  totales.forEach((elemento) => {
    const valor = parseFloat(elemento.innerText);
   
    if (!isNaN(valor)) {
      valoresTotales.push(valor);
    }
  });
  // console.log(valoresTotales)

  const sumaTotal = valoresTotales.reduce((acumulador, valor) => acumulador + valor, 0);

  // console.log(sumaTotal)

  // console.log(sumaTotal);
  actualizarTEDyB(sumaTotal)
  totalItems()
}

// recibe un valor en dolares y lo multiplica por la taza del dia para tener el total en bolivares
function actualizarTEDyB(valor){

  // console.log(valor)

  const cDolar = document.querySelector('#total-dolares');
  const cBolivares = document.querySelector('#total-bs');
  const preciodolar = document.querySelector('#dolar_input');

  // console.log(preciodolar.innerText)

  const enbs = valor*preciodolar.innerText
  cDolar.innerHTML=valor.toFixed(2)
  cBolivares.innerHTML=enbs.toFixed(2)
}

// funcion para sumar los items y mostrar el total
function totalItems(){
  const totales = document.querySelectorAll('#td_cantidad');
  const valoresTotales = [];

  totales.forEach((elemento) => {
    const valor = parseFloat(elemento.innerText);
    if (!isNaN(valor)) {
      valoresTotales.push(valor);
    }
  });

  const sumaTotal = valoresTotales.reduce((acumulador, valor) => acumulador + valor, 0);

  // console.log(sumaTotal);
  actualizarCDI(sumaTotal)
}

// remplaza el valor del input del buscador con lo que se resivio por el microfono
function remplazarinput(remplazo){

inputBuscador.value=remplazo;
buscarElemento()

}
// actualiza el contenedor de los items
function actualizarCDI(valor){
  const itensContainer =document.querySelector('#intems_totales');
  const productosContainer = document.querySelector('#productos_totales');
  const tr = contenedorCarrito.querySelectorAll('tr');
  const cantidad = tr.length;

  itensContainer.innerHTML=cantidad;
  productosContainer.innerHTML=valor
}

// recibe lo que se octiene por el microfon y lo trascrive a datos legibles y los envia a otra funcion 
function microfono(){
 
    const speechRecogniton = webkitSpeechRecognition;
    const recognition = new speechRecogniton();

    //comenzar el reconocimiento por voz 
    recognition.start();
    recognition.onstart = function(){
        console.log('Estoy escuchando...')
  
    }
    
    //retornar lo que haya escuchado al momento de iniciar el SPEECHAPI

    recognition.onspeechend = function(){
   
        recognition.stop();
    }

    recognition.onresult = function(e){
        console.log(e.results)

        var transcript = e.results[0][0].transcript;
        var confidence = e.results[0][0].confidence;

        console.log(confidence*100)
        console.log(transcript)
        remplazarinput(transcript)
    }

}

//resive todos los datos de la factura los adacta al esquema y los envia al apis rest
function cearFacturaBD(objetoList,totalAP,formaPago){

  const correo = localStorage.getItem('email')
  // console.log(objetoList,totalAP,formaPago)
  const cambiar = document.querySelector('.cfb')
  const fecha = new Date()
  const fechaLocal = fecha.toLocaleString();
  var data = 
  {
    "fecha": new Date(),
  "email_id": correo,
  "total": totalAP,
  "productos":objetoList
  }


fetch(`${ruta}/ventas`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
  .then(response => response.json())
  .then(data => {
    // console.log(data);
    
    
    articulosCarrito = [];
    vaciarCarrito();
    actualizarTEDyB(0.00)
    llamarApiVentas()


    cambiar.style.opacity = "0";

    setTimeout(() => {
      containerF.style.display = 'none';
      facturaContainer.innerHTML=""
    }, 1500); 
    
  })
  .catch(error => {
    // Manejo de errores
    console.error('Error:', error);
  });

}

//resive lo que tiene el input del buscador para hacer la busqueda de los productos que coincidan
function buscarElemento() {
  const listaElementos = document.getElementById("lista-items").getElementsByClassName("card");
  const textoBusqueda = inputBuscador.value.toLowerCase();

for (let i = 0; i < listaElementos.length; i++) {
  const elemento = listaElementos[i];
  const valor1 = elemento.dataset.info1.toLowerCase();
  const valor2 = elemento.dataset.info2.toLowerCase();

  if (valor1.includes(textoBusqueda) || valor2.includes(textoBusqueda)) {
    elemento.style.display = "block";
    listaElementos[0].parentNode.insertBefore(elemento, listaElementos[0]);
  } else {
    elemento.style.display = "none";
  }
}
}

// extrae todos los datos de la factura para enviarla a otra funcion 
function facturar(){

  const radioButtons = document.getElementsByName('pago');
  let formaPago = '';

  radioButtons.forEach((radio) => {
  if (radio.checked) {
    formaPago = radio.id;
    
  }
  
});

if(formaPago){
  const totalAPagar = document.querySelector('#total-dolares').innerText;
  const tbody = document.querySelector('.contenedor2');
  const trList = tbody.querySelectorAll('tr');

  const objetoList = [];

  trList.forEach((tr) => {
  const productoId = tr.getAttribute('id');
  const cantidad = tr.querySelector('.tdC').innerText;
  const precioU = tr.querySelector('.precio-U').innerText;

  const objeto = {
    producto: productoId,
    cantidad: cantidad,
    precioU: precioU
  };

  objetoList.push(objeto);
});
  cearFacturaBD(objetoList,totalAPagar,formaPago)

  radioButtons.forEach((radio) => {
    radio.checked = false;
    
  });
  
}else{
  alert('Introduzca la forma de pago')
}
}


async function verificarUsuario(clave) {
  try {
    const response = await fetch(`${ruta}/users/${correo}/${clave}`);
    const data = await response.json();
    const mensaje = data.msj;

    
    if (mensaje === "El usuario no existe") {
      console.log('revisa el correo');
     
    } else if (mensaje === "La contraseña es incorrecta") {
      console.log('revisa la contraseña');
    } else if (mensaje === "La contraseña es válida") {
      console.log('lo hiciste bien');
      cambiarModo2()
      cambiarActivo2()
      
    }
  } catch (error) {
    console.error("Error al llamar a la API:", error);
    
  }
}


async function cambiarModo2(){

  try {
    const modo = false;
    await fetch(`${ruta}/usersModoID/${correo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ modo }) 
    });

      
  } catch(error) {
    
  }
}


async function cambiarActivo2() {
  try {
    const activo = true;
    await fetch(`${ruta}/usersID/${correo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ activo }) 
    });

    window.location.href = '/admin/';
  } catch(error) {
    
  }
}


// *** Calcuadora ***
botones.forEach(boton => {
    boton.addEventListener("click", () => {
        const botonApretado = boton.textContent;

        if (boton.id === "c") {
            pantalla.textContent = "0";
            return;
        }

        if (boton.id === "borrar") {
            if (pantalla.textContent.length === 1 || pantalla.textContent === "Error!") {
                pantalla.textContent = "0";
            } else {
                pantalla.textContent = pantalla.textContent.slice(0, -1);
            }
            return;
        }

        if (boton.id === "igual") {
            try {
                pantalla.textContent = eval(pantalla.textContent);
            } catch {
                pantalla.textContent = "Error!";
            }
            return;
        }

        if (pantalla.textContent === "0" || pantalla.textContent === "Error!") {
            pantalla.textContent = botonApretado;
        } else {
            pantalla.textContent += botonApretado;
        }
    })
})

const password = document.querySelector('#password-input');
// eventos



btnChecked.addEventListener('change', (event) => {
  console.log('Entré al evento');

  if (event.target.checked) {
    password.type = 'text';
  } else {
    password.type = 'password';
  }
});

enviarPassword.addEventListener('click',(e)=>{
 e.preventDefault();

  const password = document.querySelector('#password-input').value;

  verificarUsuario(password)

})

bodyColor.addEventListener('input',()=>{

  bodyC.style.background=bodyColor.value
  localStorage.setItem('Tema', bodyColor.value);
 
})
// Evento calculadora +**
botonCalculadodara.addEventListener("click", function() {
  ventana.classList.toggle("oculto");
});

ventana.addEventListener("mousedown", function(event) {
  dragging = true;
  offsetX = event.clientX - ventana.offsetLeft;
  offsetY = event.clientY - ventana.offsetTop;
});

document.addEventListener("mousemove", function(event) {
  if (dragging) {
    ventana.style.left = (event.clientX - offsetX) + "px";
    ventana.style.top = (event.clientY - offsetY) + "px";
  }
});

document.addEventListener("mouseup", function() {
  dragging = false;
});
// **-Calculadora-**

btnmicrofono.addEventListener('click', microfono)

cargarEventListeners();

inputBuscador.addEventListener("input", buscarElemento);
//cargar productos de la base de datos
window.addEventListener('DOMContentLoaded', () => {
  const email = localStorage.getItem('email');
  if (email) {
    // console.log('Email almacenado:', email);
    
    fetch(`${ruta}/productos/${email}`)
    .then(response => response.json())
    .then(data => {
      
      data.forEach(objeto => {
          const nameP = objeto.name;
          const categoria = objeto.descripción;
          const precioP = objeto.precio;
          const id = objeto._id;
          crearProducto(nameP,categoria,precioP,id);
        });
    })
    .catch(error => {
      
      console.error('Error al consultar la API:', error);
    });
  } else {
    console.log('No se encontró un email');
  }
});

  let primeraVez = true; 
  btnR.addEventListener('click', () => {
    reproductorC.classList.toggle("oculto");
    
    if (primeraVez) {
      playMusic();
      primeraVez = false; 
    }
  });

  reproductorC.addEventListener("mousedown", function(event) {
    moviendo = true;
    ejex = event.clientX - reproductorC.offsetLeft;
    ejey = event.clientY - reproductorC.offsetTop;
  });
  
  document.addEventListener("mousemove", function(event) {
    if (moviendo) {
      reproductorC.style.left = (event.clientX - ejex) + "px";
      reproductorC.style.top = (event.clientY - ejey) + "px";
    }
  });
  
  document.addEventListener("mouseup", function() {
    moviendo = false;
  });
  
  let currentIndex = 0; 
function mostrarSiguienteStrong() {
  strongElements[currentIndex].style.display = 'none'; 
  currentIndex++; 

  if (currentIndex >= strongElements.length) {
    currentIndex = 0; 
  }

  strongElements[currentIndex].style.display = 'block'; 
  
  setTimeout(mostrarSiguienteStrong, 30000);
}

mostrarSiguienteStrong();
  


  