
class TileData {
  constructor() {
    this.tileSize = 16;
    this.tilesets = [];
    this.data = null;
  }

  init() {
    let numberOfTiles = 0;
    for ( let i = 0; i < this.tilesets.length; i += 1 ) {
      const currentTileset = this.tilesets[i];
      numberOfTiles += currentTileset.width * currentTileset.height;
    }
    this.data = new Uint8ClampedArray( numberOfTiles * this.tileSize * this.tileSize );

    let currentGID = 0;
    for ( let i = 0; i < this.tilesets.length; i += 1 ) {
      const currentTileset = this.tilesets[i];
      const { data } = currentTileset;
      if ( currentTileset.format === 'array' ) {
        for ( let j = 0; j < data.length; j += 1 ) {
          this.data[currentGID + j] = parseInt( data[j], 10 );
        }
      }
      else if ( currentTileset.format === 'run' ) {
        let runPosition = 0;
        let dataPosition = 0;
        while ( runPosition < data.length ) {
          const runLength = data[runPosition];
          const paletteId = parseInt( data[runPosition + 1], 10 );
          for ( let j = 0; j < runLength; j += 1 ) {
            this.data[currentGID + dataPosition] = paletteId;
            dataPosition += 1;
          }
          runPosition += 2;
        }
      }
      currentGID += currentTileset.width * currentTileset.height * this.tileSize * this.tileSize;
    }
  }

  addTileset( tileset ) {
    this.tilesets.push( tileset );
  }
}

export default TileData;
