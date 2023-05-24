export class GraficaData {
  
    private meses: string[] = ['enero', 'febrero', 'marzo', 'abril' ];
    private valores: number[] = [0, 0, 0, 0];

    constructor() { }

    getDataGrafica() {
        return [
            {  
         "name": "Ventas",
            "series": [
              {
                "name": this.meses[0],
                "value": this.valores[0]
              },
              {
                "name": this.meses[1],
                "value": this.valores[1]
              },
              {
                "name": this.meses[2],
                "value": this.valores[2]
              },
              {
                "name": this.meses[3],
                "value": this.valores[3]
              }
            ]}
        ];
    }

    incrementarValor( mes: string, valor: number ) {

        mes = mes.toLowerCase().trim();

        for( let i in this.meses ) {

            if ( this.meses[i] === mes ) {
                this.valores[i] += valor;
            }

        }

        return this.getDataGrafica();

    }


}