const fs = require('fs');

class CartManager {
    constructor() {
        this.path2 = "./src/files/carritos.json";
        this.path = "./src/files/productos.json";
    }

    
    addProduct = async (id) => {
        const products = await this.getProducts();

        try {
            const product = products.find(element => element.id === id);
            console.log(product);
            return product ? product : null;
        } catch (err) {
            console.log(`error: ${err}`);
        }
    };

    createCart = async (id, count) => {
        const carts = await this.getCarts();
      
        let cartId = 0;
      
        if (carts.length === 0) {
          cartId = 1;
        } else {
          cartId = carts[carts.length - 1].id + 1;
        }
      
        const product = await this.addProduct(id);
      
        if (product) { // Verificamos si se encontró un producto con el id proporcionado
          const newProduct = { // Creamos un nuevo objeto con la propiedad "count"
            ...product,
            count: count
          };
          const products = [newProduct]; // Agregamos el nuevo objeto al array de productos
      
          const newCart = {
            id: cartId,
            products: products,
          };
      
          carts.push(newCart);
          await fs.promises.writeFile(
            this.path2,
            JSON.stringify(carts, null, "\t")
          );
          console.log(`Carrito ${cartId} creado con éxito.`);
        } else {
          console.log(`No se encontró ningún producto con el ID ${id}`);
        }
      };
      

    getCarts = async () => { // Agregamos el parámetro limit con valor predeterminado de null
        try {
            if (fs.existsSync(this.path2)) {
                const data = await fs.promises.readFile(this.path2, "utf-8");
                const result = JSON.parse(data);
                    return result;                  
                } else { return [];}
                    
            } catch (err) {
            console.log(`error: ${err}`);
        }
    };

    getCart = async (cartId) => {
        const carts = await this.getCarts();

        try {
            const cart = carts.find(cart => cart.id === cartId);
            console.log(cart);
            return cart ? cart : null;
        } catch (err) {
            console.log(`error: ${err}`);
        }

    }


    //

    addProductToCart = async (cartId, productId, count) => {
        const carts = await this.getCarts();
    
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        if (cartIndex !== -1) {
            const product = await this.addProduct(productId);
            if (product) {
                const productIndex = carts[cartIndex].products.findIndex(p => p.id === productId);
                if (productIndex !== -1) {
                    carts[cartIndex].products[productIndex].count += count;
                } else {
                    const newProduct = {
                        ...product,
                        count: count
                    };
                    carts[cartIndex].products.push(newProduct);
                }
                await fs.promises.writeFile(this.path2, JSON.stringify(carts, null, 2));
                console.log(`Producto ${productId} agregado al carrito ${cartId}`);
            } else {
                console.log(`No se encontró ningún producto con el ID ${productId}`);
            }
        } else {
            console.log(`No se encontró ningún carrito con el ID ${cartId}`);
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



}

module.exports = CartManager;
