const express = require('express');

const routeAuth = require('./routes/autenticacion');
const routeUsuarios = require('./routes/usuarios');
const routeOrdenes = require('./routes/ordenes');
const routeProductos = require('./routes/productos');

const port = 3000;
const server = express();
server.use(express.json());

server.use('/', routeAuth);
server.use('/', routeUsuarios);
server.use('/', routeOrdenes);
server.use('/', routeProductos);

server.listen(port, () => {
    console.log(`Ejecucion del servidor en el puerto: ${port}`);
});