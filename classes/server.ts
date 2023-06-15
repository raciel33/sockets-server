
import express from 'express'
import { SERVER_PORT } from '../global/enviroments';
import socketIO  from 'socket.io';
import http from 'http';
//aqui viene la configuracion de deconexion 
import * as socket from '../sockets/sockets'

/**Nota: el constructor es private porque controla el socket para poder acceder al constructor
 * desde fuera de la clase se crea un metodo static
 */


export default class Server{
     
    private static _instance: Server;

    public app: express.Application;

    public port:number;

    public io: socketIO.Server; //encargada de emitir los eventos

    private httpServer: http.Server;
    
    //se declara private el constructor para asegurarnos de que haya una sola instancia de io
    private  constructor(){

         this.app = express();
         this.port = SERVER_PORT;

         //para usar el socket
         this.httpServer = new http.Server( this.app );
         this.io = new socketIO.Server( this.httpServer, { cors: { origin: true, credentials: true } } );
  
         this.escucharSockets();
        }                                    

    //para poder acceder a los metodos y propiedades de la clase Server
    public static get instance(){
        return this._instance || ( this._instance = new this())
    }

    private escucharSockets(){

        console.log('escuchando conexiones - sockets');

        this.io.on('connection', cliente=>{
           // console.log(` nuevo cliente conectado: ${cliente.id}` );
            
           //Conectar cliente
           socket.conectarCliente(cliente, this.io);

             //mapBox
             socket.mapaSockets(cliente, this.io );

             //googleMaps
             socket.googleMapsSockets( cliente,  this.io);


           //Configurar usuario
           socket.usuario(cliente, this.io )

           //obtener usuarios activos
           socket.obtenerUsuario( cliente, this.io)
           
            //Mensajes
            socket.mensaje( cliente, this.io )

            socket.msgPrivate( cliente, this.io )


            
            //desconectar viene de aqui: import * as socket from '../sockets/sockets'
            socket.desconectar( cliente,  this.io )

            
        })
    }

    start( callback: Function){
        this.httpServer.listen( this.port, callback());
}
}