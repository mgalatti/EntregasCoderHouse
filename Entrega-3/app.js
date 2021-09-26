const contenedorResultado = document.getElementById('jsResultado')
let total = 0;

for (let i = 1; i <= 3; i++) {
    let numeroIngresado = Number(prompt('Ingrese un numero'))
    if (!isNaN(numeroIngresado)) {
        total += numeroIngresado
    }
    let p = document.createElement('p')
    p.textContent = `${i}er número: ${numeroIngresado}`
    contenedorResultado.append(p)
}

if (total % 2 === 0) {
    contenedorResultado.append(`La suma total es ${total} y es un número par`)
} else {
    contenedorResultado.append(`La suma total es ${total} y es un número impar`)
}