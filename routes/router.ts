import nodemailer from 'nodemailer';


import{ Router, Request, Response } from 'express';
import Server  from '../classes/server';
import { Socket } from 'socket.io';
import { mapa, usuariosConectados } from '../sockets/sockets';
import { GraficaData } from '../classes/grafica';
import { googleMaps } from '../classes/google-map';

import Note from '../models/note';
import  Usuario  from '../models/usuarios';
import bcrypt from 'bcryptjs'
import { generarJWT } from '../helpers/jwt';




export const router = Router();



///PROJECT GRAFICA-------------------------------------------------------------------------------------

//instancia de esta clase
 const grafica = new GraficaData();

//devuelve los datos de la grafica
router.get('/grafica', ( req: Request, res: Response  ) => {

    res.json( grafica.getDataGrafica() );

});

//va a incrementar el valor que le pasemos del mes indicado
router.post('/grafica', ( req: Request, res: Response  ) => {

    const mes      = req.body.mes;
    const unidades = Number( req.body.unidades );

    grafica.incrementarValor( mes, unidades );

    const server = Server.instance;

    server.io.emit('cambio-grafica', grafica.getDataGrafica() );


    res.json( grafica.getDataGrafica() );

});

///PROJECT ANGULAR-SOCKETS-------------------------------------------------------------------------------------

//contacto por correo
router.post('/formulario', (req, res) => {
  res.status(200).send();
})

// devuelve los mensajes del grupo
router.get('/mensajes',async ( req: Request, res: Response)=> {
   
  const [notes] = await Promise.all([

    Note.find()

])
  res.json({
        ok:true,
        notes
    })
})

//envio de mensajes a todos los usuarios
router.post('/mensajes', async( req: Request, res: Response)=> {
   
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;

    const payload = {
        de,
        cuerpo
      };

    const server = Server.instance;

    server.io.emit('mensaje-nuevo', payload )

    
    

    res.json({
        ok:true,
        cuerpo,
        de,
        
    })
});

//envio de mensaje de un usuario especifico
router.post('/msgPrivate/:id', ( req: Request, res: Response)=> {
   
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id

    const payload = {
        de,
        cuerpo
      };

    const server = Server.instance;

    server.io.in( id ).emit('msgPrivate', payload )

    res.json({
        ok:true,
        cuerpo,
        de,
        id
    })
})

//obtener todos los IDs de los usuarios

router.get('/usuarios', ( req: Request, res: Response)=> {
   
    
    const server = Server.instance;

    server.io.fetchSockets()
    .then( (clients: any[]) => {

      if(clients.length > 0){

        let data: string[] = [];

        clients.forEach((e)=>{
          console.log(e);
          data.push(e.id);

        })       
 
      return res.json({
        ok: true,
        clients: data
        
      })
 
      }else{
        return res.json({
          ok: false,
          clients: []
          
        })
      }
 
    })
    .catch((err) => {
      return res.json({
        ok: false,
        err
      })
    })

   
})

//obtener los usuarios y sus nombres
router.get('/usuarios/detalle', ( req: Request, res: Response)=> {
   
      res.json({
        ok:true,
        clientes:usuariosConectados.getlistado()

    })
     
})

//register
router.post('/register', async ( req: Request, res: Response)=> {

  const email = req.body.email
  const password  = req.body.password; //la respuesta que viene del body
   

 /* const payload = {
        email,
        password
      };*/


  try{
 
   const existeEmail = await Usuario.findOne({ email }); //busca solo este campo
    const usuario = new Usuario(req.body); //instancia de Usuario del modelo

    //validacion para que el email sea unico
    if (existeEmail) {
        //respuesta a dar si existe el email
        return res.status(400).json({
            ok: false,
            msg: "El correo ya existe"

        })
    }


    //Encriptado de contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);


      usuario.save(); //guarda en la BD


    //generamos un token/
    
    const token = await generarJWT(usuario.id);


    res.json({
         ok: true,
        usuario, 
         token 
        
    });




}catch (error) {
    console.log(error);

    res.status(500).json({
        ok: false,
        msg: 'Error inesperado ... revisar logs '
    })



}

   
  res.json({
      ok:true,
      
      

  })
   
})
//login
router.post('/login', async ( req: Request, res: Response)=> {

  const { email, password } = req.body //extraemos el email y password

  try {
      //verificar email
      const usuarioBD = await Usuario.findOne({ email }); //captamos el email

      //si no existe el email
      if (!usuarioBD) {
          return res.status(404).json({
              ok: false,
              msg: 'email no es valido'
          })
      }

      //verificar contraseña
      /*bcrypt.compareSync: compara la contraseña que escribimos con la que esta en la base de datos
      (devuelve true si coincide)
      */
      const validPassword = bcrypt.compareSync(password, usuarioBD.password);
      //
      if (!validPassword) {
          return res.status(404).json({
              ok: false,
              msg: 'password no es valido'
          })
      }

      //Generar un tokens
      //generarJWT: viene de /heplpers/jw.js
      const token = await generarJWT(usuarioBD.id);

      //Si todo va bien devuelve :
      res.json({
          ok: true,
          token,
          usuarioBD
          
      });


  } catch (error) {
      console.log(error);
      res.status(500).json({
          ok: false,
          msg: 'Error inesperado'
      });

  }
})

//saca al usuario cuando expire el token
router.get('/renew',async (req: Request, res: Response ) => {

  const uid = req.body.uid;

  //Generar un tokens
  //generarJWT: viene de /heplpers/jw.js
  const token = await generarJWT(uid);

  //Obtener el usuario por UID
  const usuarioBD = await Usuario.findById(uid);

  //Si todo va bien
  res.json({
      ok: true,
      usuarioBD,
      token,

  })
})


router.get('/usuario/:id', async ( req: Request, res: Response)=> {

  const id = req.params.id; //captamos el id del medico a actualizar

  try {
      /**NOTA: con la funcion popularte() podemos extraer facilmente el usuario y los hospitales que creo el medico
       * y acceder a sus campos nombre, email, etc...
       */
      const usuario = await Usuario.findById(id)

      res.json({
          ok: true,
          usuario
      }); 

  } catch (error) {
      res.json({
          ok: true,
          msg: 'hable con el administrador'
      });

  }
})

///PROJECT MAPBOX-------------------------------------------------------------------------------------

//devuelve los datos del marcador
router.get('/mapa', ( req: Request, res: Response  ) => {

  res.json( mapa.getMarcadores() );

   });









///PROJECT GOOGLE-MAPS-------------------------------------------------------------------------------------
const googleMap = new googleMaps();

const lugares = [
  {
    id:'1',
    nombre: 'Udemy',
    lat: 37.784679,
    lng: -122.395936
  },
  {
    id:'2',
    nombre: 'Bahía de San Francisco',
    lat: 37.798933,
    lng: -122.377732
  },
  {
    id:'3',
    nombre: 'The Palace Hotel',
    lat: 37.788578,
    lng: -122.401745
  }
];

/**de esta forma se insertan cada elemento del arreglo como elementos independientes */
googleMap.marcadores.push(...lugares);

router.get('/googleMap', ( req: Request, res: Response  ) => {

  res.json( googleMap.getMarcadores() );

});
function configContacto(body: any) {
  throw new Error('Function not implemented.');
}

