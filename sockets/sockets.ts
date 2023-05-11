
import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuarioLista } from '../classes/usuario-lista';
import { Usuario } from '../classes/usuario';


export const usuariosConectados = new UsuarioLista();

//conectar
export const conectarCliente = ( cliente: Socket ) => {

    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregarUsuario( usuario )
}

//desconectar
export const desconectar = ( cliente: Socket) =>{
   
    cliente.on('diconnect',()=>{
        console.log('cliente desconectado');
        usuariosConectados.borrarUsuario( cliente.id  )
    })
}

//escuchar mensajes
export const mensaje = ( cliente: Socket, io: socketIO.Server) =>{
   
    cliente.on('mensaje',( payload:{ de:string, cuerpo:string } )=>{
        console.log('mensaje recibido', payload );
     
        io.emit('mensaje-nuevo', payload)//se emite a todos los que esten conectados al socket
        
 
    })
}


//configurar usuario
export const usuario = ( cliente: Socket, io: socketIO.Server) =>{
   
    cliente.on('configurar-usuario',( payload:{ nombre:string }, callback:Function )=>{
        console.log('usuario', payload.nombre );

        usuariosConectados.actualizarNombre(cliente.id, payload.nombre )

        //io.emit('configurar-usuario', payload)//se emite a todos los que esten conectados al socket
          callback({
            ok:true,
            mensaje: `Usuario ${payload.nombre } configurado`
          })
    })
}