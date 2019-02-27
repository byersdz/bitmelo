
export const MAIN_LAYER = 0;
export const BG1_LAYER = 1;
export const BG2_LAYER = 2;
export const BG3_LAYER = 3;
export const FG1_LAYER = 4;
export const FG2_LAYER = 5;
export const FG3_LAYER = 6;
export const COLLISION_LAYER = 7;
export const META_LAYER = 8;

class TileMap {
  constructor( data ) {
    this.name = '';
    this.width = 0;
    this.height = 0;
    this.layers = new Array( 9 );

    if ( data ) {
      this.name = data.name;
      this.width = data.width;
      this.height = data.height;

      if ( data.main ) {
        this.layers[MAIN_LAYER] = this.getTypedArrayFromDataLayer( data.main );
      }
      if ( data.bg1 ) {
        this.layers[BG1_LAYER] = this.getTypedArrayFromDataLayer( data.bg1 );
      }
      if ( data.bg2 ) {
        this.layers[BG2_LAYER] = this.getTypedArrayFromDataLayer( data.bg2 );
      }
      if ( data.bg3 ) {
        this.layers[BG3_LAYER] = this.getTypedArrayFromDataLayer( data.bg3 );
      }
      if ( data.fg1 ) {
        this.layers[FG1_LAYER] = this.getTypedArrayFromDataLayer( data.fg1 );
      }
      if ( data.fg2 ) {
        this.layers[FG2_LAYER] = this.getTypedArrayFromDataLayer( data.fg2 );
      }
      if ( data.fg3 ) {
        this.layers[FG3_LAYER] = this.getTypedArrayFromDataLayer( data.fg3 );
      }
      if ( data.col ) {
        this.layers[COLLISION_LAYER] = this.getTypedArrayFromDataLayer( data.col );
      }
      if ( data.meta ) {
        this.layers[META_LAYER] = this.getTypedArrayFromDataLayer( data.meta );
      }
    }
  }

  getTypedArrayFromDataLayer( dataLayer ) {
    const result = new Uint16Array( this.width * this.height );
    for ( let i = 0; i < dataLayer.length; i += 1 ) {
      result[i] = dataLayer[i];
    }
    return result;
  }
}

export default TileMap;
