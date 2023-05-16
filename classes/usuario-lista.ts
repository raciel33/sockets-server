import { Usuario } from './usuario';
import { usuario } from '../sockets/sockets';


export class UsuarioLista{

    private lista: Usuario[] = [];

    constructor(){

    }

    //Agregar un usuario
    public agregarUsuario( usuario:Usuario){

        this.lista.push( usuario );
        console.log( this.lista );
        return usuario
    }

    //actualizar
    actualizarNombre(id: string, nombre:string ){

        for( let usuario of this.lista ){
            if (usuario.id === id) {
                usuario.nombre = nombre;
                break;

            }
        }
        console.log('Usuario actualizado-------------------------------------');
        console.log(this.lista);
    }

    
    //Obtener lista
    public getLista(){
        return this.lista.filter( usuario => usuario.nombre !== 'sin-nombre')
    }

    //Obtener usuario
    public getUsuario( id:string){
        return this.lista.find( usuario => usuario.id === id
        );
    }

    
    //Obtener usuarios en una sala en particular
    public getUsuariosEnSala( sala:string){
        return this.lista.filter( usuario => usuario.sala === sala
        );
    }

    //Borrar un usuario
    public borrarUsuario( id:string){
       
    const temUser =  this.getUsuario( id );

       this.lista = this.lista.filter( usuario => usuario.id !== id);
       
       console.log(this.lista);
       
       return temUser
    }
}