
import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuarioLista } from '../classes/usuario-lista';
import { UsuarioSocket } from '../classes/usuario';
import { Mapa } from '../classes/mapa';
import { Marcador } from '../classes/marcador';
import { googleMaps } from '../classes/google-map';
import Note from '../models/note';
import Usuario from '../models/usuarios';



export const usuariosConectados = new UsuarioLista();
export const mapa = new Mapa();
export const googleMap = new googleMaps();



//---------------PROJECT GOOGLE-MAPS

//marcador-nuevo-googleMaps

export const googleMapsSockets = ( cliente: Socket, io: socketIO.Server) => {

      //creacion del marcador
      cliente.on('marcador-nuevo-googleMaps',( marcador:Marcador )=>{
            
        googleMap.agregarMarcador(marcador);

        cliente.broadcast.emit('marcador-nuevo-googleMaps', marcador )//cliente.broadcast se emite a todos menos al que lo creo
    });

 //eliminacion del marcador
    cliente.on('marcador-borrar-googleMaps',( id:string )=>{
            
        googleMap.borrarMarcador( id );

        cliente.broadcast.emit('marcador-borrar-googleMaps', id )//cliente.broadcast se emite a todos menos al que lo creo
    })

//mover el marcador
    cliente.on('marcador-mover-googleMaps',( marcador:Marcador )=>{
            
        googleMap.moverMarcador( marcador );

        cliente.broadcast.emit('marcador-mover-googleMaps', marcador )//cliente.broadcast se emite a todos menos al que lo creo
    })

}


//----------------PROJECT MAPBOX--------------------------
//eventos de mapa
export const mapaSockets = ( cliente: Socket, io:socketIO.Server ) => {
 
    //creacion del marcador
    cliente.on('marcador-nuevo',( marcador:Marcador )=>{
            
        mapa.agregarMarcador(marcador);

        cliente.broadcast.emit('marcador-nuevo', marcador )//cliente.broadcast se emite a todos menos al que lo creo
    });

//eliminacion del marcador
    cliente.on('marcador-borrar',( id:string )=>{
            
        mapa.borrarMarcador( id );

        cliente.broadcast.emit('marcador-borrar', id )//cliente.broadcast se emite a todos menos al que lo creo
    });

//mover el marcador
    cliente.on('marcador-mover',( marcador:Marcador )=>{
            
        mapa.moverMarcador( marcador );

        cliente.broadcast.emit('marcador-mover', marcador )//cliente.broadcast se emite a todos menos al que lo creo
    })



}
//conectar
export const conectarCliente =  ( cliente: Socket, io:socketIO.Server ) => {

    const usuario = new UsuarioSocket( cliente.id );
    usuariosConectados.agregarUsuario( usuario );

  


}

//desconectar
export const desconectar = ( cliente: Socket, io:socketIO.Server) =>{
   
    cliente.on('diconnect',()=>{
        console.log('cliente desconectado');

        usuariosConectados.borrarUsuario( cliente.id  );
        io.emit('usuarios-activos', usuariosConectados.getlistado())
        



    })
}

//-------------PROJECTS ANGULAR-SOCKETS----------------
//escuchar mensajes
export const mensaje = ( cliente: Socket, io: socketIO.Server) =>{
   
    cliente.on('mensaje',async( payload:{ de:string, cuerpo:string, user : string })=>{
        
        payload.user = cliente.id;
        const note = new Note(payload)
        await note.save();
        
        io.emit('mensaje-nuevo', payload)//se emite a todos los que esten conectados al socket
        
        console.log('mensaje recibido', payload );

    })
}

export const msgPrivate = ( cliente: Socket, io: socketIO.Server) =>{
   
    cliente.on('msgPrivate',( payload:{ id:string, de:string, cuerpo:string } )=>{
        
        console.log('mensaje recibido', payload );
     
        io.emit('msgPrivate', payload)//se emite a todos los que esten conectados al socket
 
    })
}


//configurar usuario
export const usuario = ( cliente: Socket, io: socketIO.Server) =>{
   
    cliente.on('configurar-usuario', async ( payload:{nombre: string ,id: string }, callback:Function )=>{
         
        payload.id = cliente.id

        console.log('Paylod',payload.nombre);

      /* const usuario = new Usuario( payload );
        await usuario.save()*/

        usuariosConectados.actualizarNombre(cliente.id, payload.nombre )
        
        io.emit('usuarios-activos', usuariosConectados.getlistado())

         io.emit('configurar-usuario', payload)//se emite a todos los que esten conectados al socket
          
         
     callback({
            ok:true,
            mensaje: `Usuario ${payload.nombre } configurado`
          })
    })
}

//Obtener usuarios
export const obtenerUsuario = ( cliente: Socket, io: socketIO.Server) =>{
   
    cliente.on('obtener-usuarios',()=>{

        io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getlistado())


    })
}