const Producto = require('../models/producto');
const Galeria = require('../models/galeria');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');
const { log } = require('console');
const { loadavg } = require('os');

const registro_producto_admin = async function (req, res) {
    if (!req.user) return res.status(403).json({ message: 'Acceso denegado: ErrorToken' });

    const data = req.body;

    try {
        // Validar campos obligatorios
        if (!data.titulo || !data.precio || !data.categoria) {
            return res.status(400).json({ message: 'Todos los campos obligatorios deben estar presentes.' });
        }

        // Validar si el producto ya existe
        const productoExistente = await Producto.findOne({ titulo: data.titulo });
        if (productoExistente) {
            return res.status(400).json({ message: 'El título del producto ya existe.' });
        }

        // Procesar imagen
        if (!req.files?.portada) {
            return res.status(400).json({ message: 'La portada es obligatoria.' });
        }
        const img_path = req.files.portada.path;
        const str_portada = img_path.split(path.sep).pop();

        // Crear producto
        data.portada = str_portada;
        data.slug = slugify(data.titulo, { lower: true });
        const producto = await Producto.create(data);

        return res.status(201).json({ success: true, data: producto });
    } catch (error) {
        console.error('Error en registro_producto_admin:', error);
        return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

//método de listar
const listar_productos_admin = async function (req, res) {
    if (req.user) {
        let filtro = req.params['filtro'];

        let productos = await Producto.find({
            $or: [
                { titulo: new RegExp(filtro, 'i') },
                { categoria: new RegExp(filtro, 'i') },
            ]
        });
        res.status(200).send(productos);
    } else {
        res.status(500).send({ data: undefined, message: "ErrorToken" });
    }
}

const obtener_portada_producto = async function (req, res) {
    let img = req.params['img'];

    fs.stat('./uploads/productos/' + img, function (err) {
        if (err) {
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        } else {
            let path_img = './uploads/productos/' + img;
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}

const obtener_producto_admin = async function (req, res) {
    if (req.user) {
        let id = req.params['id'];

        try {
            let producto = await Producto.findById({ _id: id });

            res.status(200).send(producto);
        } catch (error) {
            res.status(200).send(undefined);

        }
    } else {
        res.status(500).send({ data: undefined, message: "ErrorToken" });
    }
}

const actualizar_producto_admin = async function (req, res) {
    if (req.user) {
        let data = req.body;
        let id = req.params['id'];
        let producto = await Producto.find({ titulo: data.titulo });
        console.log(productos.length);
        if (productos.length >= 1) {
            res.status(200).send({ data: undefined, message: 'El título del producto ya existe.' });
        } else {
            if (req.files) {
                //REGISTRO PRODUCTO
                var img_path = req.files.portada.path;
                var str_img = img_path.split('\\');
                var str_portada = str_img[2];

                data.portada = str_portada;
                data.slug = slugify(data.titulo);

                try {
                    let producto = await Producto.findByIdAndUpdate({ _id: id }, {
                        titulo: data.titulo,
                        categoria: data.categoria,
                        extracto: data.extracto,
                        estado: data.estado,
                        descuento: data.descuento,
                        portada: data.portada,
                    });
                    res.status(200).send({ data: producto });
                } catch (error) {
                    res.status(200).send({ data: undefined, message: 'No se pudo crear el producto' });
                }
            } else {
                data.slug = slugify(data.titulo);

                try {
                    let producto = await Producto.findByIdAndUpdate({ _id: id }, {
                        titulo: data.titulo,
                        categoria: data.categoria,
                        extracto: data.extracto,
                        estado: data.estado,
                        descuento: data.descuento,

                    });
                    res.status(200).send({ data: producto });
                } catch (error) {
                    res.status(200).send({ data: undefined, message: 'No se pudo crear el producto' });
                }
            }
        }

    }
};

const subir_imagen_producto_admin = async function (req, res) {
    if (req.user) {
        let data = req.body;

        //REGISTRO PRODUCTO
        var img_path = req.files.imagen.path;
        var str_img = img_path.split('\\');
        var str_imagen = str_img[2];

        ///

        data.imagen = str_imagen;
        try {
            let imagen = await Galeria.create(data);
            res.status(200).send(imagen);
        } catch (error) {
            console.log(error);
            res.status(200).send({ data: undefined, message: 'No  se pudo crear el producto' });
        }
    } else {
        res.status(500).send({ data: undefined, message: 'Error Token' });
    }
};





module.exports = {
    registro_producto_admin,
    listar_productos_admin,
    obtener_portada_producto,
    obtener_producto_admin,
    actualizar_producto_admin,
    subir_imagen_producto_admin,
}


