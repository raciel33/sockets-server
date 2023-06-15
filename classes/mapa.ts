import { Marcador } from "./marcador";


export class Mapa{
    private marcadores:{ [key: string ]: Marcador} = {
       '1': {
            id: '1',
            nombre: 'Alberto',
            lng: -4.000011706930096,
            lat: 40.2905528591964,
            color: '#dd8fee'
          },
        '2': {
            id: '2',
            nombre: 'Fredy',
            lng:  -3.757328472622707,
            lat: 40.33926262249228,
            color: '#790af0'
          },
        '3': {
            id: '3',
            nombre: 'Susana',
            lng:  -3.843429651242471,
            lat:   40.35479419944501,            
            color: '#19884b'
          }
    };


    constructor(){
    }

    getMarcadores(){
       return  this.marcadores;
    }
   
    agregarMarcador( marcador: Marcador){
          this.marcadores[ marcador.id ] = marcador
    }
    
    borrarMarcador( id: string){
           delete this.marcadores[ id ];
           return this.getMarcadores()
    }

    moverMarcador( marcador: Marcador){

        this.marcadores[marcador.id].lng = marcador.lng;
        this.marcadores[marcador.id].lat = marcador.lat

    }
}