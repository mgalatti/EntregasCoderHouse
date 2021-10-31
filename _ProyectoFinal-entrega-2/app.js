import dataAnteojos from './anteojos.js'

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
const anteojos = [];
const ultimasCompras = dataAnteojos;
const localStorage = window.localStorage

// Array inputs
let arrInputs = [colorInput, materialInput, oiGradInput, oiEjeInput, odGradInput, odEjeInput]

//helper
function setAttributes(el, attrs) {
    for (let key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

class Anteojo {
    constructor(lentes, color, material, precio) {
        this.id;
        this.lentes = lentes;
        this.color = color;
        this.material = material;
        this.precio = precio;

    }
    setId(id) {
        this.id = id
    }
    setPrecio(precio) {
        this.precio = precio
    }
    getAnteojo(lentes, color, material) {
        lentes = this.lentes
        color = this.color
        material = this.material
        const { lenteD, lenteI } = lentes
        return { lenteD, lenteI, color, material }
    }

    setLentesAnteojo(gradI, ejeI, gradD, ejeD) {
        let lentes = this.lentes
        lentes.lenteD.graduacion = gradD
        lentes.lenteD.eje = ejeD
        lentes.lenteI.graduacion = gradI
        lentes.lenteI.eje = ejeI
    }
    setColorAnteojo(color) {
        this.color = color;
    }
    setMaterialAnteojo(material) {
        this.material = material;
    }

}
class Lente {
    constructor(graduacion, eje, ojo) {
        this.graduacion = graduacion;
        this.eje = eje;
        this.ojo = ojo
    }
    getLente() {
        return {
            graduacion: this.graduacion,
            eje: this.eje,
            ojo: this.ojo
        }
    }
    setLente(graduacion, eje) {
        this.graduacion = graduacion
        this.eje = eje
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
function imprimirUltimasCompras(){
    const ul = ultimasComprasUl
    ultimasCompras?.forEach((anteojo) => {
        const itemAnteojo = document.createElement('li')
        itemAnteojo.innerHTML = `Lente de receta --> <strong>Precio: $${anteojo.precio}</strong> | Material: ${anteojo.material} | Color: ${anteojo.color}`;
        console.log(ul)
        ul.appendChild(itemAnteojo)
        
    })
};
function imprimirListaAnteojos() {
    listaAnteojos.innerHTML = ''
    let anteojos = JSON.parse(localStorage.getItem('Anteojos'));
    anteojos?.forEach((anteojo, i) => {
        const btnBorrar = document.createElement('button')
        btnBorrar.textContent = 'X'
        setAttributes(btnBorrar, { "type": "button", "class": "borrarItemBtn", "id": "borrarElem" + i })
        const itemAnteojo = document.createElement('li')
        itemAnteojo.setAttribute('id', i)
        itemAnteojo.innerHTML = `Lente de receta --> <strong>Precio: $${anteojo.precio}</strong> | Material: ${anteojo.material} | Color: ${anteojo.color}`;
        itemAnteojo.appendChild(btnBorrar)
        listaAnteojos.appendChild(itemAnteojo)

        addEventListeners()
        
    })
}

// Validacion on blur
arrInputs.forEach((input) => {
    input.addEventListener('blur', validateInputs)
})

function validateInputs() {
    if (this.value === '' || this.value === '0') {
        this.classList.remove('valid')
        this.classList.add('invalid')
    } else {
        this.classList.remove('invalid')
        this.classList.add('valid')
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

        arrInputs.forEach((campo, i) => {
            if (campo.value === '' || campo.value === '0') {
                campo.classList.add('invalid')

            } else {
                campo.classList.add('valid')
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

    // muestra ultimo registro y cotizacion
    ultimoIngresoDiv.style.display = 'block'
    cotizacionDiv.style.display = 'block'

    imprimirListaAnteojos()

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
    return crearAnteojo(parLentes, color, material, precioTotal)

}

function crearAnteojo(parLentes, color, material, precioTotal) {
    let anteojo = new Anteojo(parLentes, color, material)
    anteojo.setPrecio(precioTotal)
    anteojo.setId(anteojos.length + 1)
    anteojos.push(anteojo)
    localStorage.setItem('Anteojos', JSON.stringify(anteojos))
}



//  Ordenar array de anteojos por precio
function sortByPrice(anteojos, tipo) {
    if (tipo === 'asc') {
        anteojos.sort((a, b) => a.precio - b.precio)
    }
    else if (tipo === 'des') {
        anteojos.sort((a, b) => b.precio - a.precio)
    }
    return imprimirListaAnteojos()
}
// Ordenar array de anteojos alfabeticamente segun propiedad
function sortAlfabeticamente(anteojos, propiedad) {
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
        return imprimirListaAnteojos()

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
        return imprimirListaAnteojos()
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
};
// Event Listeners

agregarAnteojoBTN.addEventListener('click', inicializarPrograma)

imprimirListaAnteojos()
imprimirUltimasCompras()