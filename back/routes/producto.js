var express = require('express');
var productoController = require('../controllers/productoController');
var authenticate = require('../middlewares/authenticate');
var multipart = require('connect-multiparty');

// Configura el directorio de carga para las imágenes de productos
var path = multipart({ uploadDir: './uploads/productos' });
var path_galeria = multipart({ uploadDir: './uploads/galeria' });

var api = express.Router();

// Ruta para registrar un nuevo producto
// Se requiere autenticación mediante el token y multipart para el manejo de imágenes
api.post('/registro_producto_admin', [authenticate.decodeToken, path], productoController.registro_producto_admin);

// Ruta para listar los productos, opcionalmente filtrados por una palabra clave
// También se requiere autenticación mediante el token
api.get('/listar_productos_admin/:filtro?', authenticate.decodeToken, productoController.listar_productos_admin);

// Ruta para obtener la portada de un producto por su nombre de archivo
api.get('/obtener_portada_producto/:img', productoController.obtener_portada_producto);
api.get('/obtener_producto_admin/:id', authenticate.decodeToken, productoController.obtener_producto_admin);
api.put('/actualizar_producto_admin/:id', [authenticate.decodeToken, path], productoController.actualizar_producto_admin);

//
// api.post('registro_ingreso_admin',[authenticate.decodeToken, path_ingreso],productoController.registro_ingreso_admin);

//
api.post('/subir_imagen_producto_admin', [authenticate.decodeToken, path_galeria], productoController.subir_imagen_producto_admin);

module.exports = api;