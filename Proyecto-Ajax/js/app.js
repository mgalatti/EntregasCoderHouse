import Lente from '../components/Lente.js'
import Anteojo from '../components/Anteojo.js'


const URL_ANTEOJOS = "bd.json"

const dbAnteojos = fetch(URL_ANTEOJOS)
    .then(response => response.json())
    .then(data => data)


//selectores elementos HTML
const oiGradHtml = document.getElementById('js-oiGraduacion')
const oiEjeHtml = document.getElementById('js-oiEje')
const odGradHtml = document.getElementById('js-odGraduacion')
const odEjeHtml = document.getElementById('js-odEje')
const precioTotalHtml = document.getElementById('jsPrecioTotal')
const listaAnteojos = document.getElementById('listaAnteojos')
const btnNuevaCotizacion = document.getElementById('js-agregarCotizacion')
const ultimoIngresoDiv = document.getElementById('ultimo-ingreso')
const cotizacionDiv = document.getElementById('cotizacion')
const ultimasComprasUl = document.getElementById('ultimasCompras')

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

const anteojos = JSON.parse(localStorage.getItem("Anteojos")) || [];

// Array inputs
let arrInputs = [colorInput, materialInput, oiGradInput, oiEjeInput, odGradInput, odEjeInput]

//helper
function setAttributes(el, attrs) {
    for (let key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}


//Valida que sean numeros
function validarNum(numI, ejeI, numD, ejeD) {
    if (isNaN(numI) || isNaN(ejeI) || isNaN(numD) || isNaN(ejeD)) {
        return false
    }
    return true
}

//metodo para imprimir en el documento
const imprimirUltimaCarga = (oiGrad, oiEje, odGrad, odEje) => {
    oiGradHtml.textContent = oiGrad
    oiEjeHtml.textContent = oiEje
    odGradHtml.textContent = odGrad
    odEjeHtml.textContent = odEje
}

async function imprimirUltimasCompras() {
    const ul = ultimasComprasUl
    const ultimasCompras = await dbAnteojos.then(result => result)
    ultimasCompras?.forEach((anteojo) => {
        const itemAnteojo = document.createElement('li')
        itemAnteojo.classList.add('cart-item')
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
function imprimirItemsCarrito() {
    listaAnteojos.innerHTML = ''
    anteojos?.forEach((anteojo, i) => {
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
            <span>$${anteojo.precio}<span>

        </div>
        `;
        itemAnteojo.appendChild(btnBorrar)
        listaAnteojos.appendChild(itemAnteojo)
    })
    addEventListeners()
}

// Validacion on blur
arrInputs.forEach((input) => {
    // input.addEventListener('blur', validateInputs)
    $(input).on('blur', validateInputs)
})

function validateInputs() {
    if (this.value === '' || this.value === '0') {
        $(this).removeClass('valid')
        $(this).addClass('invalid')
    } else {
        $(this).removeClass('invalid')
        $(this).addClass('valid')
    }
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
    colorInput.value = '0'
    materialInput.value = '0'
    oiGradInput.value = ''
    oiEjeInput.value = ''
    odGradInput.value = ''
    odEjeInput.value = ''



}

//verifica si el lente es positivo o negativo
const verificaPositivo = (lente) => lente.graduacion >= 0

//Cotiza lente positivo
const cotizarLentePositivo = (lente) => {
    lente = lente.graduacion
    let precio = 0;
    if (lente > 20) {
        precio = 500
    } else if (lente > 10) {
        precio = 300
    } else if (lente > 5) {
        precio = 150
    } else {
        precio = 50
    }
    return precio
}
//Cotiza Lente negativo
const cotizarLenteNegativo = (lente) => {
    lente = lente.graduacion
    let precio = 0;

    if (lente < -20) {
        precio = 700
    } else if (lente < -10) {
        precio = 500
    } else if (lente < -5) {
        precio = 300
    } else {
        precio = 50
    }
    return precio
}

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
    anteojo.setId(anteojos.length + 1)
    anteojos.push(anteojo)
    localStorage.setItem('Anteojos', JSON.stringify(anteojos))
}

// Botons Sort
$('#btnASC').on('click', sortByPrice)
$('#btnDES').on('click', sortByPrice)
$('#btnColor').on('click', sortAlfabeticamente)
$('#btnMaterial').on('click', sortAlfabeticamente)

//  Ordenar array de anteojos por precio
function sortByPrice() {
    const tipo = $(this).attr("data-sort")
    if (tipo === 'ASC') {
        anteojos.sort((a, b) => a.precio - b.precio)
    }
    else if (tipo === 'DES') {
        anteojos.sort((a, b) => b.precio - a.precio)
    }
    return imprimirItemsCarrito()
}
// Ordenar array de anteojos alfabeticamente segun propiedad
function sortAlfabeticamente() {
    const propiedad = $(this).attr("data-sort")
    if (propiedad === 'color') {
        anteojos.sort((a, b) => {
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
        return imprimirItemsCarrito()

    }
    if (propiedad === 'material') {
        anteojos.sort((a, b) => {
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
        return imprimirItemsCarrito()
    }

}

function addEventListeners() {
    const btnEliminarDeStorage = document.getElementsByClassName('borrarItemBtn')
    for (let item of btnEliminarDeStorage) {
        item.addEventListener('click', removeAnteojo)
    }
}


function removeAnteojo() {
    const btn = this
    const itemLi = this.closest('li')
    const idLi = itemLi.getAttribute('id')
    const idBtn = btn.getAttribute('id')
    if (idBtn.includes(idLi)) {
        anteojos.splice(idLi, 1)
    }
    itemLi.remove()
    localStorage.setItem('Anteojos', JSON.stringify(anteojos))

    cartHasItems()

};


$('#carritoBtn').click(() => {
    $('.carrito-wrapper').addClass('open')
});

$('body').on('click', (e) => {
    const flag =
        $(e.target).hasClass('carrito-wrapper')
        ||
        $(e.target).attr('id') === 'carritoBtn'
        ||
        $(e.target).hasClass('fa-shopping-cart')
        ||
        $(e.target).hasClass('borrarItemBtn')


    if ($('.carrito-wrapper').hasClass('open')) {

        if (!flag) {
            $('.carrito-wrapper').removeClass('open')

        }
    }

})

function cartHasItems() {
    if (anteojos.length > 0) {
        $('#carritoBtn').addClass('hasItems');
        $('.carrito-wrapper').addClass('hasItems')
    } else {
        $('#carritoBtn').removeClass('hasItems');
        $('.carrito-wrapper').removeClass('hasItems')
    }
}

$(document).ready(function () {
    cartHasItems()
    $(agregarAnteojoBTN).on('click', inicializarPrograma)
});

imprimirItemsCarrito()
imprimirUltimasCompras()