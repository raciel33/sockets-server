import { UsuarioSocket } from './usuario';
import { usuario } from '../sockets/sockets';
//import {Usuario} from '../models/usuarios';


export class UsuarioLista{

    public listado : UsuarioSocket[] = [];
   // public listaArr = Object.entries(this.listaObj)

    constructor(){

    }

    //Agregar un usuario
    public agregarUsuario( usuario:any){

        this.listado.push( usuario );
        console.log( this.listado );
        return usuario;
    }

    //actualizar
    actualizarNombre(id: string, nombre:string ){

        for( let usuario of this.listado ){
            if (usuario.id === id) {
                usuario.nombre = nombre;
                break;

            }
        }
        console.log('Usuario actualizado-------------------------------------');
        console.log(this.listado);
    }

    
    //Obtener listado
    public getlistado(){
        return this.listado.filter( usuario => usuario.nombre !== 'sin-nombre');
    }

    //Obtener usuario
    public getUsuario( id:string){
        return this.listado.find( usuario => usuario.id === id
        );
    }

    /*
    //Obtener usuarios en una sala en particular
    public getUsuariosEnSala( sala:string){
        return this.lista.filter( usuario => usuario.sala === sala
        );
    }*/

    //Borrar un usuario
    public borrarUsuario( id:string){
       
    const temUser =  this.getUsuario( id );

       this.listado = this.listado.filter( usuario => usuario.id !== id);
       
       console.log(this.listado);
       
       return temUser;
    }
}