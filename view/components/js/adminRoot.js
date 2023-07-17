const correo = localStorage.getItem('email');
const ruta = "/shadowsell";
validarActivo(correo)


// selectores de contenedore
const side_menu = document.getElementById('menu_side');
const body = document.getElementById('body');
const main = document.querySelector('#main');
var alert;

// seleectores de botones
const btn_open = document.getElementById('btn_open');
const seleccionado = document.querySelector('.seleccionado');
const btnCerrarSeccion = document.querySelector('#cerrar_seccion')
const btnMensajes = document.querySelector("#mensajes");
const btnUser = document.querySelector("#users")

// Eventos
btnUser.addEventListener('click',()=>{
    btnMensajes.classList.remove("seleccionado")
    btnUser.classList.add("seleccionado")
    main.innerHTML=`
    <div class="tabla_container">
        <table class="tabla_p">
            <thead class="tabla_encabezado">
                <tr>
                    <th class="tabla_titulo">
                            Nombre de Usuario
                    </th>
                    <th class="tabla_titulo">
                            correo
                    </th>
                    <th class="tabla_titulo">
                            Activo
                    </th>
                    <th class="tabla_titulo">
                        Productos
                    </th>
                    <th class="tabla_titulo">
                            Acciones
                    </th>
                </tr>
            </thead>
            <tbody id="listado-usuarios" class="tabla_list">
                
                
            </tbody>
        </table>
    `
    cargarUsers();

})



btnMensajes.addEventListener('click',()=>{
    btnUser.classList.remove("seleccionado")
    btnMensajes.classList.add("seleccionado")
    main.innerHTML=`
     <div class="container__background-triangle">
    <div class="triangle triangle1"></div>
    <div class="triangle triangle2"></div>
    <div class="triangle triangle3"></div>
</div>
<div class="container__cards" id="container__cards">

</div>
`
    llamarMensajes()
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
    cargarUsers();
});



btnCerrarSeccion.addEventListener('click',()=>{
    cambiarActivo()
})





//abre y cierra el menu de admin
function openOrCloseMenu(){
    body.classList.toggle('body_move');
    side_menu.classList.toggle('menu__side_move');
}

//valida que tu seccion este abiertas en la base de datos 
async function validarActivo() {
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



async function cargarUsers() {
    try {
        const response = await fetch(`${ruta}/users/`);
        const data = await response.json();
        
        await Promise.all(data.map(async objeto => {
            const name = objeto.name;
            const email = objeto.email;
            const activo = objeto.activo;
            const id = objeto._id;

            await cargarUsersDesdeAPI(name, email, activo, id);
        }));

        eventoEliminar();
        // eventoEditar();
    } catch (error) {
        console.error('Error al consultar la API:', error);
    }
}


//Crea los usuarios en la tabla
function cargarUsuarios(name,email,activo,id,numObjetos) {
    // console.log(email)
    const tr = document.createElement('tr');
    // tr.dataset.id =`${id}`;
    tr.innerHTML = `
        <td class="nombre">${name}</td>
        <td class="Categoria">${email}</td>
        <td class="Categoria">${activo}</td>
        <td class="Categoria">${numObjetos}</td>
        <td class="botones_tabla">
            <button id="boton_eliminar" data-id="${id}">eliminar</button>
        </td>
    `;
    const lista = document.querySelector('#listado-usuarios');
    lista.appendChild(tr);
    
    
}


async function cargarUsersDesdeAPI(name,email,activo,id) {
   
    if (email) {
        try {
            const response = await fetch(`${ruta}/productos/${email}`);
            const data = await response.json();
            const numObjetos = Object.keys(data).length;
            // console.log('Número de objetos:', numObjetos);

            cargarUsuarios(name,email,activo,id,numObjetos)
        } catch (error) {
            console.error('Error al consultar la API:', error);
        }
    } else {
        console.log('No se encontró un email en el localStorage.');
    }
}

function eventoEliminar() {
    const botonesEliminar = document.querySelectorAll('#boton_eliminar');
    // console.log(botonesEliminar)
    botonesEliminar.forEach((boton) => {
      boton.addEventListener('click', (e) => {
        const dataId = e.target.dataset.id;

            if(dataId === "64a43bd66d3e644fc0dc9b98"){
               return alert("No puedes eliminar el usuario Root")
            }else{
                
                console.log(dataId)

                const resultado = confirm("¿Estás seguro que quieres eliminar este usuario?");

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
            } 
      });
    });
}

function eliminaDeLaBD(dataId){
    console.log("1")
    fetch(`${ruta}/users/${dataId}`, {
  method: 'DELETE',
})
    .then(response => response.json())
    .then(data => { 
       console.log(data)
       alertaTwo(`<h3>Usuario Eliminado</h3>`)
  })
  .catch(error => {
    console.error('Error en la solicitud DELETE:', error);
  });

}

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

async function llamarMensajes() {
    try {
        const response = await fetch(`${ruta}/mensajes`);
        const data = await response.json();
        
        data.forEach(objeto => {
            const name = objeto.name;
            const email = objeto.email;
            const mensaje = objeto.mensaje;
            const id = objeto._id;

            // console.log(name, email, mensaje, id)
            const containerCard = document.querySelector("#container__cards")
            cargarMensajes(name, email, mensaje, id,containerCard);
        });
    } catch (error) {
        console.error('Error al consultar la API:', error);
    }
}



function  cargarMensajes(name,email , mensaje, id,containerCard){

    const divM = document.createElement('div')
    divM.classList.add("card")
    

    divM.innerHTML=`
            <h2>${name} te envío un mensaje:</h2>
            <p>${mensaje}</p>
            <hr>
            <div class="footer__card">
                <h3 class="user__name">${name}</h3>
                <i>${email}</i>
            </div>
       
        `

        containerCard.appendChild(divM)

}