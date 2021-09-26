//selectores elementos HTML
const oiGradHtml = document.getElementById('js-oiGraduacion')
const oiEjeHtml = document.getElementById('js-oiEje')
const odGradHtml = document.getElementById('js-odGraduacion')
const odEjeHtml = document.getElementById('js-odEje')
const precioTotalHtml = document.getElementById('jsPrecioTotal')
const iva = 1.21

//Valida que sean numeros 
function validarDatos(numI, ejeI, numD, ejeD) {
    if (isNaN(numI) || isNaN(ejeI) || isNaN(numD) || isNaN(ejeD)) {
        return false
    }
    return true
}

//metodo para imprimir en el documento
const imprimirEnPantalla = (oiGrad, oiEje, odGrad, odEje) => {
    oiGradHtml.textContent = oiGrad
    oiEjeHtml.textContent = oiEje
    odGradHtml.textContent = odGrad
    odEjeHtml.textContent = odEje

}

//funcion que inicializa el programa
function inicializarPrograma() {

    //pide datos
    let oiGraduacion = prompt('Ingrese graduacion Ojo Izquierdo')
    let oiEje = prompt('Ingrese eje Ojo Izquierdo')
    let odGraduacion = prompt('Ingrese graduacion Ojo Derecho')
    let odEje = prompt('Ingrese eje Ojo Derecho')

    //valida que los campos esten llenos y los parsea
    if(oiGraduacion === '' || odGraduacion === '' || oiEje === '' || odEje === ''){
        alert('Por favor ingrese todos los valores')
        inicializarPrograma()
    }else{
        oiGraduacion = Number(oiGraduacion)
        oiEje = Number(oiEje)
        odGraduacion = Number(odGraduacion)
        odEje = Number(odEje)
    }

    //si validarDatos es true, continua, sino vuelve a pedir datos
    if (validarDatos(oiGraduacion, oiEje, odGraduacion, odEje)) {
        cotizarAnteojos(oiGraduacion, odGraduacion)
        imprimirEnPantalla(oiGraduacion, oiEje, odGraduacion, odEje)

    } else {
        alert('Por favor, solo ingrese números')
        inicializarPrograma()
    }

}

const cotizarLentePositivo = (graduacion) => {
    let precio = 0;

    if (graduacion > 20) {
        precio = 500
    } else if (graduacion > 10) {
        precio = 300
    } else if (graduacion > 5) {
        precio = 150
    } else {
        precio = 50
    }
    return precio
}
const cotizarLenteNegativo = (graduacion) => {
    let precio = 0;

    if (graduacion < -20) {
        precio = 700
    } else if (graduacion < -10) {
        precio = 500
    } else if (graduacion < -5) {
        precio = 300
    } else {
        precio = 50
    }
    return precio
}

//verifica si el lente es positivo o negativo
const verificaPositivo = (graduacion) => graduacion >= 0 


//Cotiza e imprime resultado
const cotizarAnteojos = (lenteIzq, lenteDer) => {

    let precioLente1
    let precioLente2

    if(verificaPositivo(lenteIzq)){
        precioLente1 = cotizarLentePositivo(lenteIzq)
    }else{
        precioLente1 = cotizarLenteNegativo(lenteIzq)
    }

    if(verificaPositivo(lenteDer)){
        precioLente2 = cotizarLentePositivo(lenteDer)
    }else{
        precioLente2 = cotizarLenteNegativo(lenteDer)
    }
    
    let precioTotal = (precioLente1 + precioLente2) * iva

    precioTotalHtml.append(precioTotal)
}



//Se inicializa el Programa
inicializarPrograma()