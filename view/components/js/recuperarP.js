const ruta = "/shadowsell"
const btnEnviar = document.querySelector('#enviar');
const alert = document.querySelector('#alerta')



btnEnviar.addEventListener('click',(e)=>{
    e.preventDefault();
    const email = document.querySelector('#email').value;
    if(email){
        enviar(email)
    }else{
        console.log("los campos no pueden estar vacios")
    }
    
})
async function enviar(email) {
    console.log(email);
  
    try {
      const response = await fetch(`${ruta}/recuperarP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
  
      if (response.ok) {
        const data = await response.json();
        // Manejar la respuesta exitosa
        console.log('Respuesta exitosa:', data);
        mostrarAlerta("<h3>Revisa tu correo electronico.</h3>")
        setTimeout(() => {
           location.href="/"
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