const ruta = "/shadowsell"
const btnConfirmar = document.querySelector('#confirmar');
const alert = document.querySelector('#alerta')

btnConfirmar.addEventListener('click',(e)=>{
    e.preventDefault();
    const password = document.querySelector('#password').value;
    const passwordC = document.querySelector('#passwordC').value;
    const Token = document.querySelector('#token').value;
    enviar(password,passwordC,Token)
})



async function enviar(password,passwordC,Token) {
    console.log(password,passwordC,Token);
  
    try {
      const response = await fetch(`${ruta}/actualizarP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password,passwordC,Token })
      });
  
      if (response.ok) {
        const data = await response.json();
        // Manejar la respuesta exitosa
        console.log('Respuesta exitosa:', data);
        mostrarAlerta("<h3>Contraseña actualizada</h3>")
        setTimeout(() => {
           location.href="/login/login.html"
          }, 5000);
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      mostrarAlerta("<h3>Error al enviar la solicitud.</h3>")
    }
  }

  function mostrarAlerta(contenido) {
    const alerta = alert;
    alerta.innerHTML = contenido;
    alerta.classList.add('show');
  
    setTimeout(() => {
      alerta.classList.remove('show');
      setTimeout(() => {
        alerta.innerHTML = '';
      }, 300);
    }, 3000);
  }