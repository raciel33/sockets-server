
import { Socket } from 'socket.io';
import socketIO from 'socket.io';

//desconectar
export const desconectar = ( cliente: Socket) =>{
   
    cliente.on('diconnect',()=>{
        console.log('cliente deconectado');
    })
}

//escuchar mensajes
export const mensaje = ( cliente: Socket, io: socketIO.Server) =>{
   
    cliente.on('mensaje',( payload:{ de:string, cuerpo:string } )=>{
        console.log('mensaje recibido', payload );
     
        io.emit('mensaje-nuevo', payload)//se emite a todos los que esten conectados al socket
         
    })
}
