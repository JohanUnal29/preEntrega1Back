
const { Router } = require("express");


const ProductManager = require("../managers/ProductManager.js");

const productManager = new ProductManager();



// Rutas para productos
const productsRouter = Router();

productsRouter.get('/', async (req, res) => {
  const { limit } = req.query;
  const products = await productManager.getProducts(limit);
  res.json(products);
});
  
  productsRouter.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    const product = await productManager.getProductElementById(parseInt(pid));
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: `Product with id ${pid} not found` });
    }
  });
  
  productsRouter.post('/', (req, res) => {
    const product = req.body;
    const newProduct = productManager.createProduct(product);
    res.status(201).json(newProduct);
  });
  
  productsRouter.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const productUpdates = req.body;
    const updatedProduct = productManager.updateProduct(parseInt(pid), productUpdates);
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: `Product with id ${pid} not found` });
    }
  });
  
  productsRouter.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    const success = productManager.deletProduct(parseInt(pid));
    if (success) {
      res.json({ message: `Product with id ${pid} deleted` });
    } else {
      res.status(404).json({ error: `Product with id ${pid} not found` });
    }
  });
  

  module.exports = productsRouter;
