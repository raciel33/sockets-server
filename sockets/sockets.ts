
import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuarioLista } from '../classes/usuario-lista';
import { Usuario } from '../classes/usuario';


export const usuariosConectados = new UsuarioLista();

//conectar
export const conectarCliente = ( cliente: Socket, io:socketIO.Server ) => {

    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregarUsuario( usuario );



}

//desconectar
export const desconectar = ( cliente: Socket, io:socketIO.Server) =>{
   
    cliente.on('diconnect',()=>{
        console.log('cliente desconectado');

        usuariosConectados.borrarUsuario( cliente.id  );
        io.emit('usuarios-activos', usuariosConectados.getLista())
        



    })
}

//escuchar mensajes
export const mensaje = ( cliente: Socket, io: socketIO.Server) =>{
   
    cliente.on('mensaje',( payload:{ de:string, cuerpo:string } )=>{
        console.log('mensaje recibido', payload );
     
        io.emit('mensaje-nuevo', payload)//se emite a todos los que esten conectados al socket
 
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
   
    cliente.on('configurar-usuario',( payload:{ nombre:string }, callback:Function )=>{
        console.log('usuario', payload.nombre );

        usuariosConectados.actualizarNombre(cliente.id, payload.nombre )

        io.emit('usuarios-activos', usuariosConectados.getLista())

        //io.emit('configurar-usuario', payload)//se emite a todos los que esten conectados al socket
          callback({
            ok:true,
            mensaje: `Usuario ${payload.nombre } configurado`
          })
    })
}

//Obtener usuarios
export const obtenerUsuario = ( cliente: Socket, io: socketIO.Server) =>{
   
    cliente.on('obtener-usuarios',()=>{

        io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getLista())


    })
}