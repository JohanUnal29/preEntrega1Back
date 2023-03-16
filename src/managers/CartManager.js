const fs = require('fs');

class ProductManager {
    constructor() {
        this.path2 = "./src/files/carrito.json";
        this.path = "./src/files/productos.json";
    }


    addProduct = async (id, count) => {
        const products = await this.getProducts();
        const productsCart = await this.getProductsCart();
      
        try {
          const product = products.find(element => element.id === id);
          const productExist = productsCart.find(element2 => element2.id === id);
      
          if (productExist) {

            const number = {
                count
            }
            const newcount = number.count + productExist.count;
            
            const productIndex = productsCart.findIndex((product) => product.id === id);
            if (productIndex === -1) {
              console.error("Producto no encontrado");
              return;
            } else {
              const updatedProduct = {
                ...productsCart[productIndex],count: newcount
              };
              productsCart[productIndex] = updatedProduct;
      
              await fs.promises.writeFile(this.path2, JSON.stringify(productsCart, null, "\t"));
            }
          } else {
            const product2 = { ...product, ...count };
            productsCart.push(product2);
            await fs.promises.writeFile(
              this.path2,
              JSON.stringify(productsCart, null, "\t")
            );
          }
        } catch (err) {
          console.log(`error: ${err}`);
        }
      };
      



    updateCountProduct = async (id, changes) => {
        try {
            const data = await fs.promises.readFile(this.path2, "utf-8");
            const result = JSON.parse(data);
            this.products = result;

            const productIndex = this.products.findIndex((product) => product.id === id);
            if (productIndex === -1) {
                console.error("Producto no encontrado");
                return;
            }

            if ("id" in changes || "title" in changes || "description" in changes || "price" in changes || "thumbnail" in changes || "code" in changes) {
                throw new Error("solo puedes cambiar la cantidad");
            }

            const updatedProduct = { ...this.products[productIndex], ...changes };
            this.products[productIndex] = updatedProduct;

            await fs.promises.writeFile(this.path2, JSON.stringify(this.products, null, "\t"));

            console.log(`Producto actualizado: ${updatedProduct.title}`);
        } catch (error) {
            console.error(`Error al leer o actualizar el archivo ${this.path2}: ${error.message}`);
            throw error;
        }
    };


    getProductsCart = async (limit = null) => { // Agregamos el parámetro limit con valor predeterminado de null
        try {
            if (fs.existsSync(this.path2)) {
                const data = await fs.promises.readFile(this.path2, "utf-8");
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


    deletProduct = async (id) => {
        const products = await this.getProductsCart();

        const productIndex = products.findIndex((product) => product.id === id);
        const productExists = products.find(element => element.id === id);

        if (productExists) {
            products.splice(productIndex, 1);
            console.log("producto eliminado");
            await fs.promises.writeFile(this.path2, JSON.stringify(products, null, "\t"));
            return products;

        } else {
            return console.log("No se pudo eliminar el producto")
        }

    };

}

module.exports = ProductManager;
