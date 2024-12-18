var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');

var port = process.env.port || 4201;

var app = express();

var cliente_router = require('./routes/cliente');
var usuario_router = require('./routes/usuario');
var producto_router = require('./routes/producto');

app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyparser.json({ limit: '50mb', extended: true }));

// Función asincrónica para conectar a la base de datos
async function conectarDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/tienda', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conexión exitosa a la base de datos');
        // Inicia el servidor una vez que la conexión a la base de datos sea exitosa
        app.listen(port, function () {
            console.log('Servidor corriendo en el puerto ' + port);
        });
    } catch (err) {
        console.log('Error al conectar a la base de datos:', err);
    }
}

// mongoose.connect('mongodb://127.0.0.1:27017/tienda', (err, res) => {
//     if (err) {
//         console.log(err);
//     } else {
//         app.listen(port, function () {
//             console.log('Servidor corriendo ' + port);
//         });
//     }
// });

// Llamada a la función para conectar
conectarDB();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow', 'GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.use('/api', cliente_router);
app.use('/api', usuario_router);
app.use('/api', producto_router);


module.exports = app;