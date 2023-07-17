//selectores
const btnPlus = document.querySelector('#boton_plus')
const btnMax = document.querySelector('#boton_max')
const priceMax = document.querySelector('#planC');
const pricePlus = document.querySelector('#planP');
localStorage.removeItem("pago");

const ruta = "/shadowsell";
//esta es una funcion que se auto llama para escuchar un evento que escucha cuando hacemos click en una de las flechas de pregunta frecuente
//recoriendolas toda y creadoles un evento escuchar para saber a cual se le hace click
(function(){
    const titleQuestions = [...document.querySelectorAll('.question_title')];
    // console.log(titleQuestions)
    titleQuestions.forEach(question =>{
        question.addEventListener('click', ()=>{
            let height = 0;
            let answer = question.nextElementSibling;
            let addPadding = question.parentElement.parentElement;

            addPadding.classList.toggle('question_padding--add')

            question.children[0].classList.toggle('question_arrow--rotate');

            if(answer.clientHeight === 0){
                height = answer.scrollHeight;
            }

            answer.style.height = `${height}px`
        })
    })
})();

//esta funcion es para el menu 
(function(){
    const openButton = document.querySelector('.nav_menu');
    const menu =document.querySelector('.nav_link');
    const closeMenu = document.querySelector('.nav_close')
    const imgMenu = document.querySelector('.cta_menu')

    openButton.addEventListener('click', ()=>{
        menu.classList.add('nav_link--show')
        imgMenu.style.display='none'
    });

    closeMenu.addEventListener('click', ()=>{
        menu.classList.remove('nav_link--show')
        imgMenu.style.display='block'
    })
})();



const planMax = parseInt(priceMax.textContent)
const planplus = parseInt(pricePlus.textContent)



btnPlus.addEventListener('click', (e)=>{
    e.preventDefault()
    pago(planplus)
})
btnMax.addEventListener('click',(e)=>{
    e.preventDefault()
    pago(planMax)
})


async function pago(price){
    const response = await fetch(`${ruta}/crearOrden`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        precio: price,
        
        })
        });
        localStorage.setItem('pago', price);
        const data = await response.json();
        
            window.location.href = data.links[1].href
}