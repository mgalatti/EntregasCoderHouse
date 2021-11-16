const URL_ANTEOJOS = "bd.json"

const dbAnteojos = fetch(URL_ANTEOJOS)
    .then(response => response.json())
    .then(data => data)


//selectores elementos HTML
const oiGradHtml = document.getElementById('js-oiGraduacion')
const oiEjeHtml = document.getElementById('js-oiEje')
const odGradHtml = document.getElementById('js-odGraduacion')
const odEjeHtml = document.getElementById('js-odEje')


//  inputs
const colorInput = document.getElementById('selectColor')
const materialInput = document.getElementById('selectMaterial')
const oiGradInput = document.getElementById('oiGraduacionInput')
const oiEjeInput = document.getElementById('oiEjeInput')
const odGradInput = document.getElementById('odGraduacionInput')
const odEjeInput = document.getElementById('odEjeInput')

//mapeo
const localStorage = window.localStorage

//ultimasCompras get Storage
let ultimasCompras = JSON.parse(localStorage.getItem("comprasAnteriores")) || [];
const ultimasComprasDb = await dbAnteojos.then(result => result)
if(localStorage.getItem('comprasAnteriores') === '' || localStorage.getItem('comprasAnteriores') === null){
ultimasCompras.push(...ultimasComprasDb)
}



//----------------------    Funciones  -------------------------------------------

//Helper setAttributes para elementos html
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

// valida vacio o 0
function validateInputs() {
    if (this.value === '' || this.value === '0') {
        $(this).removeClass('valid')
        $(this).addClass('invalid')
    } else {
        $(this).removeClass('invalid')
        $(this).addClass('valid')
    }
}

// Limpia los campos
function limpiaCampos() {
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




//metodo para imprimir en el documento
const imprimirUltimaCarga = (oiGrad, oiEje, odGrad, odEje) => {
    oiGradHtml.textContent = oiGrad
    oiEjeHtml.textContent = oiEje
    odGradHtml.textContent = odGrad
    odEjeHtml.textContent = odEje
}





export { setAttributes, validateInputs, validarNum, limpiaCampos, verificaPositivo,
    cotizarLenteNegativo, cotizarLentePositivo, imprimirUltimaCarga }