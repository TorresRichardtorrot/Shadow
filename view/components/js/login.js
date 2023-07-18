const inputEmail = document.querySelector('#email');
const inputPassword = document.querySelector('#password');
const btnInit = document.querySelector('#btn_init');
const alert = document.querySelector('#alerta')
const ruta = "/shadowsell"

//esta funcion verifica si el formulario esta llenado correctamente y le envia los dato a otra funcion
btnInit.addEventListener('click', (event) => {
  event.preventDefault();
  
  const email = inputEmail.value;
  const clave = inputPassword.value;
  // console.log(email,clave)
  if(email ===""||clave ===""){
    mostrarAlerta("<h3>¡Los campos no pueden estar vacios!</h3>")
  }else{
    verificarUsuario(email, clave);
  }

  
});

//esta funcion sirve para verificar si los datos del usuario son correctos 
async function verificarUsuario(email, clave) {
    try {
      const response = await fetch(`${ruta}/users/${email}/${clave}`);
      const data = await response.json();
      const mensaje = data.msj;
  
      
      if (mensaje === "El usuario no existe") {
        // console.log('revisa el correo');
      
        mostrarAlerta("<h3>¡No existe el usuario!</h3>");
      } else if (mensaje === "La contraseña es incorrecta") {
        // console.log('revisa la contraseña');
      
        mostrarAlerta("<h3>¡Contraseña incorrecta!</h3>");
      } else if (mensaje === "La contraseña es válida") {
        // console.log('lo hiciste bien');
      
        mostrarAlerta("<h3>¡Ingreso exitoso!</h3>");

        cambiarActivo(email)
        // Guardar email en el localStorage
        localStorage.setItem('email', email);
        
        // console.log('se ha guardado en el localStorage');
        
      }
      
      
    } catch (error) {
      console.error("Error al llamar a la API:", error);
      mostrarAlerta("<h3>¡Ocurrio un error intente de nuevo!</h3>");
    }
  }
  //funcion de la alerta
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

  //funcion para redirigir 
  function redirigirAPagina() {
    cambiarModo3()
    window.location.href = '/admin/';
  }
  async function cambiarModo3(){

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
  
  //esta funcion es para agregarle el activo en la base de datos al usuario
  async function cambiarActivo(email) {
    try {
      const activo = true;
      await fetch(`${ruta}/usersID/${email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ activo }) 
      });
  
      redirigirAPagina();
    } catch(error) {
      
    }
  }
  