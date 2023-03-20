
const { Router } = require("express");


const CartManager = require("../managers/CartManager.js");

const cartManager = new CartManager();



// Rutas para productos
const cartsRouter = Router();

cartsRouter.get('/', async (req, res) => {
    const products = await cartManager.getCarts();
    if(products.length == 0){
        res.status(404).json({ error: `Cart empity` });
    }else{
        res.json(products);
    }
        
});

cartsRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await cartManager.getCart(parseInt(cid));
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: `Product with id ${cid} not found` });
    }
});

cartsRouter.post('/', async (req, res) => {
    const productId = parseInt(req.body.productId);
    const count = parseInt(req.body.count);
    await cartManager.createCart(productId, count);

    res.sendStatus(200);
});


cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const count = parseInt(req.body.count);

    await cartManager.addProductToCart(cartId, productId, count);

    res.status(200).json({ error: `cambios realizados` });
});



module.exports = cartsRouter;
