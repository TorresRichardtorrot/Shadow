const formulario = document.querySelector('#formulario');
const inputNombre = document.querySelector('#name');
const inputEmail = document.querySelector('#email');
const inputPassword = document.querySelector('#password');
const inputMatch = document.querySelector('#match');
const btnRegistro = document.querySelector('#btn-registro');
const alert = document.querySelector('#alerta')
const alertaPago = localStorage.getItem('pago');
const ruta = "/shadowsell"
var pagoK=false

if(alertaPago){
    mostrarAlerta("<h3>¡Pago realizado con éxito!</h3>")

    setTimeout(() => {
        mostrarAlerta("<h3>¡Regístrese para finalizar los preparativos!</h3>")
      }, 4000);
    pagoK = true
    
}
function btnVal (){

    const va1 = inputEmail.classList.contains('green');
    const va2 = inputPassword.classList.contains('green');
    const va3 = inputMatch.classList.contains('green');

    if(va1 && va2 && va3 ){
        btnRegistro.disabled = false;
    
    }else{
        btnRegistro.disabled = true;
        
    }
}
btnVal()

//validar
const emailVali=/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

const passwordval =/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm


let valemail = false;
let valpass = false;
let valMatch = false;

inputEmail.addEventListener('input',e=>{
    // console.log(e.target.value);
    valemail = emailVali.test(e.target.value)
    // console.log(valemail);
    validar(inputEmail,valemail);
})

inputPassword.addEventListener('input',e=>{
    // console.log(e.target.value);
    valpass = passwordval.test(e.target.value);
    validar(inputPassword,valpass)
    // console.log(valpass);
    validar(inputMatch,valMatch)
})

inputMatch.addEventListener('input', e=>{
    // console.log(e.target.value);
    valMatch = e.target.value === inputPassword.value;
    validar(inputMatch,valMatch);
    validar(inputPassword,valpass);
})


const validar = (input,val)=>{
    // console.log('validar',val)

    if(val){
        //caso que el test arroge true
        input.classList.remove('input-control')
        input.classList.remove('red')
        input.classList.add('green')
        btnVal()
        
    }else{
        //caso de que el test arroje false
        input.classList.remove('green')
        input.classList.add('red')
        btnVal()
    }
    
   
}

function obtenerDatosValidados() {
    const name = inputNombre.value;
    const email = inputEmail.value;
    const clave = inputPassword.value;
    const confirmaClave = inputMatch.value;
    const activo = false;
    const modo = false;
    const pago = pagoK
    return { name, email, clave, confirmaClave,activo,modo,pago };
}

btnRegistro.addEventListener('click', (event) => {
    event.preventDefault();
    
    const datosValidados = obtenerDatosValidados();
    
    // Realizar la solicitud al api rest mediante el metodo post
    fetch(`${ruta}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosValidados)
    })
    .then(response => response.json())
    .then(data => {
        // Procesar la respuesta de la API
        // console.log(data.msj);
        const msj = data.msj;
        if(msj==="El usuario ya existe"){
            mostrarAlerta("<h3>¡El usuario ya existe!</h3>")
        }else{
            if(msj==="Usuario almacenado correctamente"){
                localStorage.removeItem("pago");
                redirigirAPagina()
            }

        }
    })
    .catch(error => {
        console.error('Error al enviar los datos:', error);
    });
});

function mostrarAlerta(contenido) {
    const alerta = alert;
    alerta.innerHTML = contenido;
    alerta.classList.add('show');
  
    setTimeout(() => {
      alerta.classList.remove('show');
      setTimeout(() => {
        alerta.innerHTML = '';
      }, 300);
    }, 1700);
  }

function redirigirAPagina() {
    window.location.href = '/login/login.html';
  }
  