const correo = localStorage.getItem('email');
const ruta = "/shadowsell";
validarActivo(correo)
validarModo2()

// selectores de contenedore
const side_menu = document.getElementById('menu_side');
const body = document.getElementById('body');
const main = document.querySelector('#main');
var alert;
// seleectores de botones
const btnIrAShadow =document.querySelector('#ir_Aapp')
const btnStadisticas = document.querySelector('#balance_venta');
const btnProducto = document.querySelector('#Producto');
const btnNuevoP = document.querySelector('#nuevo_producto');
const btn_open = document.getElementById('btn_open');
const seleccionado = document.querySelector('.seleccionado');
const btnCerrarSeccion = document.querySelector('#cerrar_seccion')
var btnGuardar;
var btnEliminar;
var tipoChart ="bar"

// Eventos

btnIrAShadow.addEventListener('click',()=>{
  cambiarModo()
  cambiarActivo2()
})

btnStadisticas.addEventListener('click',()=>{
    btnStadisticas.classList.add('seleccionado')
    btnProducto.classList.remove('seleccionado')
    btnNuevoP.classList.remove('seleccionado')
    estadisticas()
})
document.getElementById('btn_open').addEventListener('click', openOrCloseMenu);

if (window.innerWidth < 760) {
    body.classList.add('body_move');
    side_menu.classList.add('menu__side_move');
}

window.addEventListener('resize', function() {
    if (window.innerWidth > 760) {
        body.classList.remove('body_move');
        side_menu.classList.remove('menu__side_move');
    }
    if (window.innerWidth < 760) {
        body.classList.add('body_move');
        side_menu.classList.add('menu__side_move');
    }
});
window.addEventListener('DOMContentLoaded', () => {
    cargarProductosDesdeAPI();
});

btnProducto.addEventListener('click', () => {
    crearTabla()
});
btnNuevoP.addEventListener('click', () => {
    main.innerHTML = "";
    btnProducto.classList.remove('seleccionado');
    btnStadisticas.classList.remove('seleccionado')
    btnNuevoP.classList.add('seleccionado');
    main.innerHTML=`
    <form action="" class="formulario">
            <div class="div_c">
            <center><div><img src="/Cpts/imagen/logo-negro.png" alt="logo"></div></center>
            <h2 class="titulo_formulario">Nuevo Producto</h2>
            <div class="form_container">

                <div class="from_group">
                    <input type="text" id="name_producto" class="form_input" placeholder=" ">
                    <label for="name_producto" class="form_label">Nombre</label>
                    <span class="form_line"></span>
                </div>
                <div class="from_group">
                    <input type="number" id="Precio_producto" class="form_input" min="1" placeholder=" ">
                    <label for="Precio_producto" class="form_label">Precio</label>
                    <span class="form_line"></span>
                </div>
                <div class="from_group">
                    <input type="text" id="categoria_producto" class="form_input" placeholder=" ">
                    <label for="categoria_producto" class="form_label">Categoría</label>
                    <span class="form_line"></span>
                </div>
                <input type="submit" class="form_guardar" id="guardar_producto" value="Guardar">
            </div>
        </div>
        </form>
         
    `
     btnGuardar = document.querySelector('#guardar_producto')
     alert = document.querySelector('#alerta');

     btnGuardar.addEventListener('click',(e)=>{
        e.preventDefault();
    
        crearProducto()
    })
});
btnCerrarSeccion.addEventListener('click',()=>{
    cambiarActivo()
})

// funciones
async function validarModo2() {
  
  if(correo){
      try {
          const response = await fetch(`${ruta}/usersModo/${correo}`);
          const data = await response.json();
          const mensage = data.message;

            console.log(data)

          if (mensage === true) {
            console.log(`El campo activo es true`);
                
                window.location.href = '/app/ShadowSell.html'
          }
        } catch (error) {
          console.error('Ocurrió un error al validar el campo activo:', error);
          
          window.location.href ="/"
         
        }
  
      }
}

async function cambiarActivo2() {
  try {
    const activo = false;
    await fetch(`${ruta}/usersID/${correo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ activo }) 
    });
      window.location.href = '/app/ShadowSell.html'
  } catch(error) {
    
  }
}

async function cambiarModo(){

  try {
    const modo = true;
    await fetch(`${ruta}/usersModoID/${correo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ modo }) 
    });
      
      window.location.href = '/app/ShadowSell.html'
  } catch(error) {
    
  }
}

//abre y cierra el menu de admin
function openOrCloseMenu(){
    body.classList.toggle('body_move');
    side_menu.classList.toggle('menu__side_move');
}

//valida que tu seccion este abiertas en la base de datos 
async function validarActivo() {
    if(correo === "Root"){
      window.location.href="/adminRoot/index.html"
    }
    if(correo){
        try {
            const response = await fetch(`${ruta}/usersActivo/${correo}`);
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
              window.location.href ="/"
            }
          } catch (error) {
            console.error('Ocurrió un error al validar el campo activo:', error);
          }
    }else{
        window.location.href ="/"
    }
    
}

//trae del api todos los productos 
function cargarProductosDesdeAPI() {
    const email = localStorage.getItem('email');
    if (email) {
        fetch(`${ruta}/productos/${email}`)
            .then(response => response.json())
            .then(data => {
                data.forEach(objeto => {
                    const nameP = objeto.name;
                    const categoria = objeto.descripción;
                    const precioP = objeto.precio;
                    const id = objeto._id;

                    cargarProducto(nameP, categoria, precioP, id);
                    
                });
                eventoEliminar()
                eventoEditar()
            })
            .catch(error => {
                console.error('Error al consultar la API:', error);
            });
    } else {
        console.log('No se encontró un email en el localStorage.');
    }
}

//Crea los productos en la tabla
function cargarProducto(nameP, categoria, precioP, id) {
    const tr = document.createElement('tr');
    // tr.dataset.id =`${id}`;
    tr.innerHTML = `
        <td class="nombre">${nameP}</td>
        <td class="Precio">${precioP}</td>
        <td class="Categoria">${categoria}</td>
        <td class="botones_tabla">
            <button id="boton_eliminar" data-id="${id}">eliminar</button>
            <button id="boton_editar" data-id="${id}">editar</button>
        </td>
    `;
    const lista = document.querySelector('#listado-Productos');
    lista.appendChild(tr);
    
    
}
// esta funcion crea la tabla con los productos despues de precionar el boton productos
function crearTabla(){
    btnStadisticas.classList.remove('seleccionado')
    btnNuevoP.classList.remove('seleccionado');
    btnProducto.classList.add('seleccionado');
    main.innerHTML = `
        <div class="tabla_container">
            <table class="tabla_p">
                <thead class="tabla_encabezado">
                    <tr>
                        <th class="tabla_titulo">Nombre Producto</th>
                        <th class="tabla_titulo">Precio</th>
                        <th class="tabla_titulo">Categoría</th>
                        <th class="tabla_titulo">Acciones</th>
                    </tr>
                </thead>
                <tbody id="listado-Productos" class="tabla_list"></tbody>
            </table>
        </div>
    `;
    cargarProductosDesdeAPI();
}
//esta funcion crea los productos en la base de datos 
function crearProducto(){
    const nombreDelProducto = document.querySelector('#name_producto');
    const precioDelProducto = document.querySelector('#Precio_producto');
    const categoriaDelProducto = document.querySelector('#categoria_producto');
    const formulario = document.querySelector('.formulario');
    const email = localStorage.getItem('email');
    // console.log(nombreDelProducto,precioDelProducto,categoriaDelProducto)

    if(nombreDelProducto.value ===""|| precioDelProducto.value ===""|| categoriaDelProducto.value ==="" ){
        alertaTwo('<h3>!Los campos no pueden esta vacios¡</h3>')
        
    }else{
        if(email){
            const name = nombreDelProducto.value;
            const precio = precioDelProducto.value;
            const descripción = categoriaDelProducto.value;
            const email_id = email
    
            const datosProducto ={name,precio,descripción,email_id}
            console.log(datosProducto)
            fetch(`${ruta}/productos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosProducto)
                
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.message === "El producto ya existe") {
                  alertaTwo('<h3>¡El producto ya existe!</h3>');
                } else if (data.message === "Guardado") {
                  alertaTwo('<h3>¡Guardado en la base de datos!</h3>');
                  formulario.reset();
                }
              })
            .catch(error => {
                console.error('Error al enviar los datos:', error);
            });
        }

    }

    
}

function obtenerDatosValidados() {
    const name = inputNombre.value;
    const email = inputEmail.value;
    const clave = inputPassword.value;
   const confirmaClave = inputMatch.value;
    return { name, email, clave, confirmaClave };
}

//esta funcion crea una alerta con el mensaje que resive
function alertaTwo(mensaje){
    // console.log(alert)
    alert.innerHTML=mensaje;
    alert.classList.add('show');

    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            alert.innerHTML = '';
        }, 300);
      }, 2700);
}

//funcion para cerrar seccion
async function cambiarActivo() {
    const correo = localStorage.getItem('email');
    try {

      const activo = false;
      await fetch(`${ruta}/usersID/${correo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ activo }) 
      });
      localStorage.removeItem('email');
      window.location.href = '/';
    } catch(error) {
      
    }
}

//esta funcion elimina los productos
function eventoEliminar() {
    const botonesEliminar = document.querySelectorAll('#boton_eliminar');
  
    botonesEliminar.forEach((boton) => {
      boton.addEventListener('click', (e) => {
        const dataId = e.target.dataset.id;

        const resultado = confirm("¿Estás seguro que quieres eliminar este producto?");
if (resultado) {
    eliminaDeLaBD(dataId);
  
    // Acceder al elemento padre (tr) y eliminarlo
    const tr = e.target.closest('tr');
    if (tr) {
      tr.remove();
    }
//   console.log("aceptado");
} else {

  console.log("cancelado");
}
        
        
      });
    });
}
//esta funcion elimina los productos de la base de datos 
function eliminaDeLaBD(dataId){
    fetch(`${ruta}/productosID/${dataId}`, {
  method: 'DELETE',
})
    .then(response => response.json())
    .then(data => { 
        console.log(data);
        const mjs = data.message;
        if (mjs === "Producto eliminado") {
        console.log('Recurso eliminado');
        alertaTwo(`<h3>Producto Eliminado</h3>`);
        
     } else {
        
     }
  })
  .catch(error => {
    // Ocurrió un error en la solicitud
    console.error('Error en la solicitud DELETE:', error);
  });

}

//esta funcion crea una alerta con el mensaje que resive
function alertaTwo(mensage){
    const alertContainer = document.querySelector('#alerta_Eliminar');
    alertContainer.innerHTML=mensage
    alertContainer.classList.add('show');

    setTimeout(() => {
        alertContainer.classList.remove('show');
        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 300);
      }, 2700);
}

//esta funcion lee los datos del producto que queremos editar
function eventoEditar(){
    const btnEditar = document.querySelectorAll('#boton_editar')

    btnEditar.forEach((boton) => {
        boton.addEventListener('click', (e) => {
        
          const dataId = e.target.dataset.id;
          
          const tr = e.target.closest('tr');
    
          const nombreTd = tr.querySelector('.nombre');
          const precioTd = tr.querySelector('.Precio');
          const categoriaTd = tr.querySelector('.Categoria');
          editarProducto(nombreTd.textContent,precioTd.textContent,categoriaTd.textContent,dataId)
          
          
        });
      });
    
}

//esta funcion crea un formulario para editar el producto con los datos obtenidos
function editarProducto(nombre,precio,categoria,id){
    // console.log(categoria)
    main.innerHTML = "";
    main.innerHTML=
    `
    <form action="" class="formulario">
            <div class="div_c">
            <center><div><img src="/Cpts/imagen/logo-negro.png" alt="logo"></div></center>
            <h2 class="titulo_formulario">Editar Producto</h2>
            <div class="form_container">

                <div class="from_group">
                    <input type="text" id="E_name" class="form_input" placeholder=" " value="${nombre}">
                    <label for="E_name" class="form_label">Nombre</label>
                    <span class="form_line"></span>
                </div>
                <div class="from_group">
                    <input type="number" id="E_precio" class="form_input" min="1" placeholder=" " value="${precio}">
                    <label for="E_precio" class="form_label">Precio</label>
                    <span class="form_line"></span>
                </div>
                <div class="from_group">
                    <input type="text" id="E_categoria" class="form_input" placeholder=" " value="${categoria}">
                    <label for="E_categoria" class="form_label">Categoría</label>
                    <span class="form_line"></span>
                </div>
                <input type="submit" class="form_guardar" id="editar_producto" value="Guardar">
            </div>
        </div>
        </form>`

        const bntEditarGuardar = document.querySelector('#editar_producto');

        EscucharFuntion(bntEditarGuardar,id)


}

//esta funcion revisa que los datos del formulario esten llenados correctamente para enviarlos a la base de datos
function EscucharFuntion(boton,id){
    
    boton.addEventListener('click',(e)=>{
        e.preventDefault();
        
        const name = document.querySelector('#E_name');
        const precio = document.querySelector('#E_precio');
        const categoria = document.querySelector('#E_categoria');
        
        if(name.value ===""||precio.value ===""||categoria.value ===""){
            alertaTwo("<h3>Los campos no pueden estar vacios</h3>")
        }else{
            editarEnBD(name.value,precio.value,categoria.value,id)
        }
    })
};

//edita el producto en la base de datos
async function editarEnBD(name, precio, descripcion, id) {
    console.log(precio);
    try {
      await fetch(`${ruta}/productosEdit/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, precio, descripcion })
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          main.innerHTML=""
            crearTabla()
            alertaTwo("<h3>!Se a editado con exito¡</h3>")
        });
    } catch (error) {
      console.log(error);
    }
}
// crea el container con un canva para crear las estadisticas
  function estadisticas (){
    main.innerHTML=''
    main.innerHTML=`
   <div>
   </div>
    <div id="contenedor_estadisticas" style="width: 100%;">
        <canvas id="myChart"></canvas>
      </div>
      `
      const ctx = document.querySelector('#myChart');
     if(ctx){
        llamarApiVentas(correo,ctx)
     }

      
}

// esta enumera las fechas y las veses que se repite 
  function contarFrecuenciaFechas(fechas,ctx) {
  
    const frecuenciaFechas = new Map();
  
    // Recorre el arreglo de fechas y cuenta la frecuencia
    for (const fecha of fechas) {
      const fechaSinHora = fecha.substring(0, 10); // Obtiene solo el día, mes y año
  
      if (frecuenciaFechas.has(fechaSinHora)) {
        frecuenciaFechas.set(fechaSinHora, frecuenciaFechas.get(fechaSinHora) + 1);
      } else {
        frecuenciaFechas.set(fechaSinHora, 1);
      }
    }
  
    // Convierte el objeto Map a un objeto JSON
    const resultado = {};
    for (const [fecha, frecuencia] of frecuenciaFechas) {
      resultado[fecha] = frecuencia;
    }
  
    const frecuencia = resultado;
  
  // Convertir el objeto JSON a un arreglo de pares clave-valor
  const frecuenciaArray = Object.entries(frecuencia);
  
  // Extraer las fechas y las repeticiones en variables separadas
  const fechas2 = frecuenciaArray.map(([fecha, _]) => fecha);
  const repeticiones = frecuenciaArray.map(([_, repeticion]) => repeticion);
  
//   console.log(fechas2);
//   console.log(repeticiones);
console.log(ctx)
  
  crearGraficoDeBarras(ctx,fechas2,repeticiones)
  
} 

//crea la graficas usando el metodo que descrive la documentacion de bart chart
  function crearGraficoDeBarras(ctx,fechas2,repeticiones) {
    // fechas2 = fechas2.map(fecha => {
    //     let lastDigit = parseInt(fecha.slice(-1));
    //     let updatedLastDigit = lastDigit - 1;
    //     return fecha.slice(0, -1) + updatedLastDigit;
    //   });
    
  
    new Chart(ctx, {
      type: tipoChart,
      data: {
        labels: fechas2,
        datasets: [{
          label: '# Ventas',
          data: repeticiones,
          backgroundColor: [
            'rgb(0, 85, 255)',
          ],
          borderColor: [
            'rgb(0, 195, 255)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
} 

//esta funcion trae los datos de venta del api 
  async function llamarApiVentas(email,ctx) {
    try {
      const response = await fetch(`${ruta}/ventas/${email}`);
      if (response.ok) {
        const data = await response.json();
        
        
        // console.log(data);
        // const fechasLocales = data.map((fecha) => fecha.toLocaleString());
        
        contarFrecuenciaFechas(data,ctx)
  
      } else {
        console.log('Error en la respuesta de la API');
      }
    } catch (error) {
      console.log('Error al realizar la solicitud:', error);
    }
}
  