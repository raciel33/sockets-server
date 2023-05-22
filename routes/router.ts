

import{ Router, Request, Response } from 'express';
import Server  from '../classes/server';
import { Socket } from 'socket.io';
import { usuariosConectados } from '../sockets/sockets';
import { GraficaData } from '../classes/grafica';
import { Mapa } from '../classes/mapa';

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

// devuelve los mensajes del grupo
router.get('/mensajes', ( req: Request, res: Response)=> {
   
    res.json({
        ok:true,
        mensaje: 'Todo esta bien'
    })
})

//envio de mensajes a todos los usuarios
router.post('/mensajes', ( req: Request, res: Response)=> {
   
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
        de
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
        clientes:usuariosConectados.getLista()

    })
     
})

///PROJECT MAPBOX-------------------------------------------------------------------------------------
const mapa = new Mapa();

//devuelve los datos del marcador
router.get('/mapa', ( req: Request, res: Response  ) => {

  res.json( mapa.getMarcadores() );

});