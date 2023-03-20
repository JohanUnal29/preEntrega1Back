const fs = require('fs');

class ProductManager {
    constructor() {
        this.path = "./src/files/productos.json";
    }


    createProduct = async (producto) => {

        const productos = await this.getProducts();
        const productExists = productos.find(element => element.code === producto.code);
        if (!producto.title || !producto.description || !producto.price || !producto.code || !producto.stock) {
            return console.log("Hay un campo vacío");
        } else {

            if (productExists) {
                return console.log("El producto ya existe acá esta:", productExists);;
            } else {
                if (productos.length === 0) {
                    producto.id = 1;
                } else {
                    producto.id = productos[productos.length - 1].id + 1;
                }
                productos.push(producto);
                await fs.promises.writeFile(
                    this.path,
                    JSON.stringify(productos, null, "\t")
                );
            }
        }
    };



    updateProduct = async (id, changes) => {
        try {
          const data = await fs.promises.readFile(this.path, "utf-8");
          const result = JSON.parse(data);
          this.products = result;
      
          const productIndex = this.products.findIndex((product) => product.id === id);
          if (productIndex === -1) {
            console.error("Producto no encontrado");
            return;
          }
      
          if ("id" in changes) {
            throw new Error("No se permite actualizar el id");
          }
      
          const updatedProduct = { ...this.products[productIndex], ...changes };
          this.products[productIndex] = updatedProduct;
      
          await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, "\t"));
      
          console.log(`Producto actualizado: ${updatedProduct.title}`);
        } catch (error) {
          console.error(`Error al leer o actualizar el archivo ${this.path}: ${error.message}`);
          throw error;
        }
      };
      

    getProducts = async (limit = null) => { // Agregamos el parámetro limit con valor predeterminado de null
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, "utf-8");
                const result = JSON.parse(data);
                if (limit) { // Si se proporciona el parámetro de límite, devolvemos solo la cantidad especificada
                    return result.slice(0, limit);
                } else { // Si no se proporciona el parámetro de límite, devolvemos todos los productos
                    return result;
                }
            } else {
                return [];
            }
        } catch (err) {
            console.log(`error: ${err}`);
        }
    };

    getProductElementById = async (id) => {
        const products = await this.getProducts();

        try {
            const product = products.find(element => element.id === id);
            console.log(product);
            return product ? product : null;
        } catch (err) {
            console.log(`error: ${err}`);
        }

    };

    deletProduct = async (id) => {
        const products = await this.getProducts();

        const productIndex = products.findIndex((product) => product.id === id);
        const productExists = products.find(element => element.id === id);

        if (productExists) {
            products.splice(productIndex, 1);
            console.log("producto eliminado");
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
            return products;

        } else {
            return console.log("No se pudo eliminar el producto")
        }

    };

}

module.exports = ProductManager;
