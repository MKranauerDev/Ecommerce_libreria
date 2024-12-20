var Usuario = require('../models/usuario');
var bcrypt = require('bcrypt');
var jwt = require('../helpers/jwt');
const usuario = require('../models/usuario');

const registro_usuario_admin = async function(req, res) {
    if(req.user){
        let data = req.body;

        // Verificar que `nombres` y `apellidos` están presentes
        if (!data.nombres || !data.apellidos) {
            return res.status(400).send({ message: 'Los campos nombres y apellidos son requeridos' });
        }

        let usuarios = await Usuario.find({email: data.email});
        //Encriptar constraseña
        if(usuarios.length >=1){
            res.status(200).send({data:undefined,message: 'El correo electronico ya existe'});
        }else{
            bcrypt.hash('123456', 10, async function(err, hash) {
                if (err) {
                    res.status(500).send({ data: undefined, message: 'No se pudo encriptar la contraseña' });
                } else {
                    data.password = hash;
                    try {
                        let usuario = await Usuario.create(data);
                        res.status(200).send({ data: usuario });
                    } catch (error) {
                        res.status(500).send({ message: 'Error al crear el usuario', error: error });
                    }
                }
            })
        }

    }else{
        res.status(500).send({ data: undefined, message: 'Error Token' });
    }
    
};

const login_usuario = async function(req,res){
    var data = req.body;

    var usuarios = await Usuario.find({email: data.email});
    
    if(usuarios.length >= 1){
        //Correo existe
        if ( usuarios[0].estado) {
            bcrypt.compare(data.password, usuarios[0].password, async function(err,check){
                if (check) {
                    res.status(200).send({
                        token:jwt.createToken(usuarios[0]),
                        usuario: usuarios[0],
                    });
                }else{
                    res.status(200).send({data:undefined,message: 'La contraseña es incorrecta.'});
                }
            });
        }else{
            res.status(200).send({data:undefined, message: 'Su cuenta está desactivada.'});
        }
    }else{
        res.status(200).send({data:undefined, message: 'No se encontró el correo electrónico.'});
    }
    
}

const listar_usuario_admin = async function(req, res) {
    if (req.user) {
        let filtro = req.params['filtro'];

        let usuarios = await Usuario.find({
            $or:[
                {nombres: new RegExp(filtro,'i')},
                {apellidos: new RegExp(filtro,'i')},
                {email: new RegExp(filtro,'i')},
            ]
        });
        res.status(200).send(usuarios);
    }else{
        res.status(500).send({data:undefined, message:"ErrorToken"});
    }
}

const obtener_usuario_admin = async function(req,res){
    if (req.user) {
        let id = req.params['id'];
        try {
            let usuario = await Usuario.findById({_id: id});
        
            res.status(200).send(usuario);
        } catch (error) {
            res.status(200).send(undefined);
            
        }
    }else{
        res.status(500).send({data:undefined, message:"ErrorToken"});
    }
}
const actualizar_usuario_admin = async function(req,res){
    if (req.user) {
        let id = req.params['id'];
        let data = req.body;

        let usuario = await Usuario.findByIdAndUpdate({_id:id},{
            nombres: data.nombres ,
            apellidos: data.apellidos,
            rol: data.rol,
            email: data.email ,
        });
        res.status(200).send(usuario);
        
    }else{
        res.status(500).send({data:undefined, message:"ErrorToken"});
    }
}
const cambiar_estado_usuario_admin = async function(req,res){
    if (req.user) {
        let id = req.params['id'];
        let data = req.body;

        let nuevo_estado = false;

        if (data.estado) {
            nuevo_estado = false;
        }else{
            nuevo_estado = true;
        }

        let usuario = await Usuario.findByIdAndUpdate({_id:id},{
            estado: nuevo_estado
        });
        res.status(200).send(usuario);
        
    }else{
        res.status(500).send({data:undefined, message:"ErrorToken"});
    }
}

module.exports = {
    registro_usuario_admin,
    login_usuario,
    listar_usuario_admin,
    obtener_usuario_admin,
    actualizar_usuario_admin,
    cambiar_estado_usuario_admin,
}
