export default class Lente {
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
