const  inputNombre = document.querySelector('#name');
const  inputEmail = document.querySelector('#email');
const  textarea = document.querySelector('#textarea');
const   btnEnviar= document.querySelector('#btn-enviar');


function btnVal (){
    const va1 = inputEmail.classList.contains('green');
    

    if(va1){
        btnEnviar.disabled = false;
    
    }else{
        btnEnviar.disabled = true;
        
    }
}
btnVal()

//validar
const emailVali=/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/




let valemail = false;


inputEmail.addEventListener('input',e=>{
    // console.log(e.target.value);
    valemail = emailVali.test(e.target.value)
    // console.log(valemail);
    validar(inputEmail,valemail);
})

const validar = (input,val)=>{
    // console.log('validar',val)


    
        if(val){
        //caso que el test arroge true
        input.classList.remove('input-control')
        input.classList.remove('red')
        input.classList.add('green')
        btnVal()
        
    }else if(!val){
        //caso de que el test arroje false
        input.classList.remove('green')
        input.classList.add('red')
        btnVal()
    }else

    if(input ===""){
        input.classList.add('input-control')
        input.classList.remove('red')
        input.classList.remove('green')
    }
    

}

function obtenerDatosValidados() {
    const name = inputNombre.value;
    const email = inputEmail.value;
    const mensaje = textarea.value;
    enviarMensaje(name, email, mensaje)
}

btnEnviar.addEventListener('click',(e)=>{
    e.preventDefault();
    obtenerDatosValidados()
})
  


//para el ejemplo

async function enviarMensaje(name, email, mensaje) {
    try {
        await fetch('/shadowsell/mensajes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, mensaje }) 
        })
        .then(response => response.json())
        .then(data => {
           console.log(data)
           window.location.href="/"
        });
    } catch (error) {
        console.error('Error al enviar los datos:', error);
    }
}
