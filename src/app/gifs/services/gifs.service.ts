import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey:       string = '4xI88NL1k1xsL4RG22UOz365TZsLKogm';
  private serviceUrl:   string = 'https://api.giphy.com/v1/gifs';

  constructor( private http: HttpClient ) {
    this.loadLocalStorage();
    console.log('Gifs Service Ready');
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string){
    // La linea de abajo se encarga de pasar todo a minuscula con el fin de buscar si los valores ya estan registrados o noanteriormente.
    tag = tag.toLowerCase();

    if ( this._tagsHistory.includes(tag) ) {
    // La linea de abajo se encarga de validar si hay un tag nuevo diferente a algun oldTag lo deje pasar de lo contrario no.
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag )
    }
    // Esta linea se encarga de que el nuevo tag se agrege al inicio o la parte de arriba de la lista de tags.
    this._tagsHistory.unshift( tag );
    this._tagsHistory = this._tagsHistory.splice(0,10);
    this.saveLocalStorage();

  }
  // ES UNA FUNCIONA PARA CONVERTIR EN STRING CUALQUIER EXPRESION
  private saveLocalStorage():void{
    localStorage.setItem('history', JSON.stringify( this._tagsHistory ) );
  }

  private loadLocalStorage():void{
  // IF  para validar si se tiene data en el HISTORY por medio de negacion es decir si no hay nada no hacer nada y hacer el return para finalizar la funcion.
    if ( !localStorage.getItem('history') ) return;
    // SE CONVIERTE EL OBJETO HISTORY DE UN STRING A UN ARREGLO PARA RECUPERAR EL OBJETO EL CUAL ES UN ARREGLO DE STRINGS
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    if ( this._tagsHistory.length === 0 ) return;
    this.searchTag( this._tagsHistory[0] );
  }

   searchTag( tag: string ):void {
    if ( tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey )
      .set('limit', '10' )
      .set('q', tag )

    this.http.get<SearchResponse>(`${ this.serviceUrl }/search`, { params })
      .subscribe( resp => {

        this.gifList = resp.data;
        //console.log({ gifs: this.gifList });

      } );


  }


}
