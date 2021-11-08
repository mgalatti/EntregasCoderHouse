export default class Anteojo {
    constructor(lentes, color, material, precio, image) {
        this.id;
        this.lentes = lentes;
        this.color = color;
        this.material = material;
        this.precio = precio;
        this.image = image;

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
    setImage(image) {
        this.image = image
    }

}