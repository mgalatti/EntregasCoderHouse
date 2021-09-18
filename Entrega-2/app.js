let numero1 = prompt("Ingrese un número")
let numero1Parsed = Number(numero1)

let numero2 = prompt("Ingrese otro número para comparar")
let numero2Parsed = Number(numero2)


if ((numero1 === '') || (numero2 === '')) {
    console.log('Necesita ingresar ambos números')
} else if (numero1Parsed < numero2Parsed) {
    console.log(`${numero2Parsed} es mayor a ${numero1Parsed}`)
} else if (numero1Parsed > numero2Parsed) {
    console.log(`${numero1Parsed} es mayor a ${numero2Parsed}`)
} else if (numero1Parsed === numero2Parsed){
    console.log('Ambos numeros son iguales')
}


