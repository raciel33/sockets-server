import { Marcador } from "./marcador";


export class googleMaps{

    public marcadores: Marcador[] = [];

    constructor(){


    }


    getMarcadores(){
        return  this.marcadores;
     }
    
     agregarMarcador( marcador: Marcador){
         this.marcadores.push( marcador) 
    }

    borrarMarcador( id: string){
        
      this.marcadores = this.marcadores.filter( mark => mark.id != id)
        return this.marcadores;
 }

    moverMarcador( marcador: Marcador){
       //iteramos los marcadores
        for (const i in this.marcadores) {
            //si el id de nuestros marcadores coincide con el que recibe por parametro
            if( this.marcadores[i].id === marcador.id){
                //asignamos latitud y longitud 
                this.marcadores[i].lng = marcador.lng;
                this.marcadores[i].lat = marcador.lat

                break;
            }
        }

   }
}


