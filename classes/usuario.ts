

export class Usuario{

    id:string;
    nombre:string;
    public sala:string;

    constructor( id:string){
         
        this.id = id;
        this.nombre = 'sin-nombre';
        this.sala = 'sin-sala';
    }
}