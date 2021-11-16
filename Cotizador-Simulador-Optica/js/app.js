import Lente from '../components/Lente.js'
import Anteojo from '../components/Anteojo.js'
import {
        setAttributes, 
        validateInputs, 
        validarNum, 
        limpiaCampos, 
        verificaPositivo, 
        cotizarLenteNegativo, 
        cotizarLentePositivo,
        imprimirUltimaCarga,
    } from './helpers.js'


// trae ultimas compras de una bd json
const URL_ANTEOJOS = "bd.json"

// fetch db
const dbAnteojos = fetch(URL_ANTEOJOS)
    .then(response => response.json())
    .then(data => data)


//selectores elementos HTML
const precioTotalHtml = document.getElementById('jsPrecioTotal')
const listaAnteojos = document.getElementById('listaAnteojos')
const ultimoIngresoDiv = document.getElementById('ultimo-ingreso')
const ultimasComprasUl = document.getElementById('ultimasCompras')
const comprarBtn = document.getElementById('comprar')
const compraExitosa = document.getElementsByClassName('compra-exitosa')


// iva
const iva = 1.21

//  inputs
const colorInput = document.getElementById('selectColor')
const materialInput = document.getElementById('selectMaterial')
const oiGradInput = document.getElementById('oiGraduacionInput')
const oiEjeInput = document.getElementById('oiEjeInput')
const odGradInput = document.getElementById('odGraduacionInput')
const odEjeInput = document.getElementById('odEjeInput')

//BTN Agregar
const agregarAnteojoBTN = document.getElementById('agregarAnteojoBTN')

//mapeo
const localStorage = window.localStorage

//inicializa array carritoAnteojos
let carritoAnteojos = JSON.parse(localStorage.getItem("carritoAnteojos")) || [];

//ultimasCompras get Storage
let ultimasCompras = JSON.parse(localStorage.getItem("comprasAnteriores")) || [];
const ultimasComprasDb = await dbAnteojos.then(result => result)
if(localStorage.getItem('comprasAnteriores') === '' || localStorage.getItem('comprasAnteriores') === null){
ultimasCompras.push(...ultimasComprasDb)
}

// Array inputs
let arrInputs = [colorInput, materialInput, oiGradInput, oiEjeInput, odGradInput, odEjeInput]


// Validacion on blur
arrInputs.forEach( input => $(input).on('blur', validateInputs))

function removeAnteojo() {
    const btn = this
    const itemLi = this.closest('li')
    const idLi = itemLi.getAttribute('id')
    const idBtn = btn.getAttribute('id')
    if (idBtn.includes(idLi)) {
        carritoAnteojos.splice(idLi, 1)
    }
    itemLi.remove()
    localStorage.setItem('carritoAnteojos', JSON.stringify(carritoAnteojos))

    cartHasItems()
    imprimirItemsCarrito()

};

function addEventListeners() {
    const btnEliminarDeStorage = document.getElementsByClassName('borrarItemBtn')
    for (let item of btnEliminarDeStorage) {
        item.addEventListener('click', removeAnteojo)
    }
    const verMasCarrito = document.getElementsByClassName('ver-mas')

    for (let item of verMasCarrito){
        item.addEventListener('click', mostrarGraduacion)
    }
    

    const lentesDatosCarrito = document.getElementsByClassName('lentes-datos')

    function mostrarGraduacion(e){
        const lentes = $(e.target).parent().next()[0]
        if(!lentes.classList.contains('show')){
        lentes.classList.add('show')
        e.target.innerHTML = '-'
        }else {
        lentes.classList.remove('show')
        e.target.innerHTML = 'i'

        }

    }
}
//Agrega marca de que el carrito tiene items
function cartHasItems() {
    if (carritoAnteojos.length > 0) {
        $('#carritoBtn').addClass('hasItems');
        $('.carrito-wrapper').addClass('hasItems')
        $('#carritoBtn').attr('data-content', carritoAnteojos.length)
    } else {
        $('#carritoBtn').removeClass('hasItems');
        $('.carrito-wrapper').removeClass('hasItems')
        $('#carritoBtn').attr('data-content', '')
    }
}
function imprimirItemsCarrito() {
    comprarBtn.style.display =  'block'
    listaAnteojos.innerHTML = ''

    carritoAnteojos?.forEach((anteojo, i) => {
        const btnBorrar = document.createElement('button')
        btnBorrar.textContent = 'REMOVER'
        setAttributes(btnBorrar, { "type": "button", "class": "borrarItemBtn", "id": "borrarElem" + i })
        const itemAnteojo = document.createElement('li')
        itemAnteojo.classList.add('cart-item')
        itemAnteojo.setAttribute('id', i)
        itemAnteojo.innerHTML =
            `
        <div>
            <img src="${anteojo.image}" width="80">
            <p>${anteojo.material}</p>
            <p>${anteojo.color}</p>
            <span>$${anteojo.precio}</span>
            <span class="ver-mas">i</span>

        </div>
        <div class="lentes-datos">
        <ul>
        <li>Ojo Izq: ${anteojo.lentes.lenteI.graduacion}</li>
        <li>Ojo Der: ${anteojo.lentes.lenteD.graduacion}</li>
        </ul>
        </div>
        `;
        itemAnteojo.appendChild(btnBorrar)
        listaAnteojos.appendChild(itemAnteojo)
    })
    if(carritoAnteojos.length === 0){
        listaAnteojos.innerHTML = '<li>No tenés items</li>'
        comprarBtn.style.display =  'none'
    }
    addEventListeners()
}


async function imprimirUltimasCompras() {

    let ul = ultimasComprasUl
    ul.innerHTML = ''
    ultimasCompras?.forEach((anteojo) => {
        const itemAnteojo = document.createElement('li')
        itemAnteojo.classList.add('cart-item')
        itemAnteojo.innerHTML = '';
        itemAnteojo.innerHTML = `
        <div>
            <img src="${anteojo.image}" width="80">
            <p>${anteojo.material}</p>
            <p>${anteojo.color}</p>
            <span>$${anteojo.precio}<span>
            

        </div>
        `;
        ul.appendChild(itemAnteojo)

    })

};

//Cotiza e imprime resultado
const cotizarAnteojos = (parLentes, color, material) => {

    let image;
    if (material.toLowerCase() === 'metal') {
        image = 'img/anteojo-1.jpeg'
    }
    if (material.toLowerCase() === 'plastico') {
        image = 'img/anteojo-2.jpeg'
    }
    if (material.toLowerCase() === 'madera') {
        image = 'img/anteojo-3.jpeg'
    }
    let { lenteI, lenteD } = parLentes
    let precioLente1
    let precioLente2

    if (verificaPositivo(lenteI)) {
        precioLente1 = cotizarLentePositivo(lenteI)
    } else {
        precioLente1 = cotizarLenteNegativo(lenteI)
    }

    if (verificaPositivo(lenteD)) {
        precioLente2 = cotizarLentePositivo(lenteD)
    } else {
        precioLente2 = cotizarLenteNegativo(lenteD)
    }

    let precioTotal = (precioLente1 + precioLente2) * iva


    precioTotalHtml.innerText = precioTotal

    //Creo elemento con color y material estatico.
    return crearAnteojo(parLentes, color, material, precioTotal, image)

}

function crearAnteojo(parLentes, color, material, precioTotal, image) {
    let anteojo = new Anteojo(parLentes, color, material)
    anteojo.setPrecio(precioTotal)
    anteojo.setImage(image)
    anteojo.setId(carritoAnteojos.length + 1)
    carritoAnteojos.push(anteojo)
    localStorage.setItem('carritoAnteojos', JSON.stringify(carritoAnteojos))
}

//funcion que inicializa el programa
function inicializarPrograma(ev) {
    ev.preventDefault()

    arrInputs.forEach((item) => {
        item.classList.remove('invalid', 'valid')
    })
    //mapea datos
    let color = colorInput.value
    let material = materialInput.value
    let oiGraduacion = oiGradInput.value
    let oiEje = oiEjeInput.value
    let odGraduacion = odGradInput.value
    let odEje = odEjeInput.value


    // valida que los campos esten llenos y los parsea
    if (oiGraduacion === '' || odGraduacion === '' || oiEje === '' || odEje === '' || color === '' || material === '') {

        arrInputs.forEach((campo) => {
            if (campo.value === '' || campo.value === '0') {
                $(campo).addClass('invalid')
            } else {
                $(campo).addClass('valid')
            }

        })

        return
    } else {
        oiGraduacion = Number(oiGraduacion)
        oiEje = Number(oiEje)
        odGraduacion = Number(odGraduacion)
        odEje = Number(odEje)
    }

    //si validarDatos es true, continua, sino vuelve a pedir datos
    if (validarNum(oiGraduacion, oiEje, odGraduacion, odEje)) {
        const parLentes = {
            lenteI: new Lente(oiGraduacion, oiEje, 'I', color, material),
            lenteD: new Lente(odGraduacion, odEje, 'D', color, material)
        }
        cotizarAnteojos(parLentes, color, material)
        imprimirUltimaCarga(oiGraduacion, oiEje, odGraduacion, odEje)

    } else {
        alert('Por favor, solo ingrese números')
        inicializarPrograma()
    }

    imprimirItemsCarrito()
    cartHasItems()

    // Muestra ultimo ingreso
    $(ultimoIngresoDiv).slideDown(400).delay(2500).slideUp(1000)



    // Limpia los campos
    limpiaCampos()

}


// Botons Sort selectores
$('#btnASC').on('click', sortByPrice)
$('#btnDES').on('click', sortByPrice)
$('#btnColor').on('click', sortAlfabeticamente)
$('#btnMaterial').on('click', sortAlfabeticamente)



$('#carritoBtn').click(() => {
    $('.carrito-wrapper').addClass('open')
});

//cerrar carrito on click out
$('body').on('click', (e) => {
    const flag =
        $(e.target).hasClass('carrito-wrapper')
        ||
        $(e.target).attr('id') === 'carritoBtn'
        ||
        $(e.target).hasClass('fa-shopping-cart')
        ||
        $(e.target).hasClass('borrarItemBtn')
        ||
        $(e.target).hasClass('ver-mas')


    if ($('.carrito-wrapper').hasClass('open')) {

        if (!flag) {
            $('.carrito-wrapper').removeClass('open')

        }
    }

})


//  Ordenar array de carritoAnteojos por precio
function sortByPrice() {
    const tipo = $(this).attr("data-sort")
    if (tipo === 'ASC') {
        ultimasCompras.sort((a, b) => a.precio - b.precio)
    }
    else if (tipo === 'DES') {
        ultimasCompras.sort((a, b) => b.precio - a.precio)
    }
    return imprimirUltimasCompras()
}
// Ordenar array de ultimasCompras alfabeticamente segun propiedad
function sortAlfabeticamente() {
    const propiedad = $(this).attr("data-sort")
    if (propiedad === 'color') {
        ultimasCompras.sort((a, b) => {
            let colorA = a.color.toLowerCase();
            let colorB = b.color.toLowerCase()
            if (colorA < colorB) {
                return -1
            }
            if (colorB < colorA) {
                return 1
            }
            return 0
        })
        return imprimirUltimasCompras()

    }
    if (propiedad === 'material') {
        ultimasCompras.sort((a, b) => {
            let materialA = a.material.toLowerCase();
            let materialB = b.material.toLowerCase()
            if (materialA < materialB) {
                return -1
            }
            if (materialB < materialA) {
                return 1
            }
            return 0
        })
        return imprimirUltimasCompras()
    }

}



$(document).ready(function () {
    cartHasItems()
    $(agregarAnteojoBTN).on('click', inicializarPrograma)
});

function mostrarCompraExitosa() {
    $(compraExitosa).show().delay(2000).fadeOut()
}

// COMPRAR
function comprar() {

    ultimasCompras.push(...carritoAnteojos)
    localStorage.setItem('comprasAnteriores', JSON.stringify(ultimasCompras))
    carritoAnteojos = []

    localStorage.setItem('carritoAnteojos', JSON.stringify(carritoAnteojos))
    mostrarCompraExitosa()
    imprimirUltimasCompras()
    imprimirItemsCarrito()
    cartHasItems()

}

//Boton Comprar
comprarBtn.addEventListener('click', comprar)

// Inicializar
imprimirItemsCarrito()
imprimirUltimasCompras()




