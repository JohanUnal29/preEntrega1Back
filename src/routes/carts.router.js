
const { Router } = require("express");


const CartManager = require("../managers/CartManager.js");

const cartManager = new CartManager();



// Rutas para productos
const cartsRouter = Router();

cartsRouter.get('/', async (req, res) => {
    const { limit } = req.query;
    const products = await cartManager.getProductsCart(limit);
    res.json(products);
});


cartsRouter.post('/:pid', (req, res) => {
    const { pid } = req.params;
    const newProduct = cartManager.addProduct(parseInt(pid));
    res.status(201).json(newProduct);
});

cartsRouter.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const productUpdates = req.body;
    const updatedProduct = cartManager.updateCountProduct(parseInt(pid), productUpdates);
    if (updatedProduct) {
        res.json(updatedProduct);
    } else {
        res.status(404).json({ error: `Product with id ${pid} not found` });
    }
});

cartsRouter.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    const success = cartManager.deletProduct(parseInt(pid));
    if (success) {
        res.json({ message: `Product with id ${pid} deleted` });
    } else {
        res.status(404).json({ error: `Product with id ${pid} not found` });
    }
});


module.exports = cartsRouter;
