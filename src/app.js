const express = require('express');

const app = express();
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");


// Middleware para parsear el body de las requests
app.use(express.json());


// Montamos los routers en sus respectivos paths
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Iniciamos el servidor
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
