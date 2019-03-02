
/**
 * Holds all of the tile data.
 */
class TileData {
  constructor() {
    this.tileSize = 16;
    this.tilesets = [];
    this.data = null;
  }

  /**
   * Parse all of the tilesets and add them to the data array
   */
  init() {
    let numberOfTiles = 0;
    for ( let i = 0; i < this.tilesets.length; i += 1 ) {
      const currentTileset = this.tilesets[i];
      numberOfTiles += currentTileset.width * currentTileset.height;
    }
    this.data = new Uint8ClampedArray( numberOfTiles * this.tileSize * this.tileSize );

    let startPosition = 0;
    let firstGid = 1;
    for ( let i = 0; i < this.tilesets.length; i += 1 ) {
      const currentTileset = this.tilesets[i];
      currentTileset.firstGid = firstGid;
      const { data } = currentTileset;
      if ( currentTileset.format === 'array' ) {
        for ( let j = 0; j < data.length; j += 1 ) {
          this.data[startPosition + j] = parseInt( data[j], 10 );
        }
      }
      else if ( currentTileset.format === 'run' ) {
        let runPosition = 0;
        let dataPosition = 0;
        while ( runPosition < data.length ) {
          const runLength = data[runPosition];
          const paletteId = parseInt( data[runPosition + 1], 10 );
          for ( let j = 0; j < runLength; j += 1 ) {
            this.data[startPosition + dataPosition] = paletteId;
            dataPosition += 1;
          }
          runPosition += 2;
        }
      }
      firstGid += currentTileset.width * currentTileset.height;
      startPosition += currentTileset.width * currentTileset.height * this.tileSize * this.tileSize;
    }
  }

  /**
   * Add a tileset
   * @param {Object} tileset - the tileset data
   */
  addTileset( tileset ) {
    this.tilesets.push( tileset );
  }

  /**
   * Get the GID for a tile
   * @param {number} x - x position of the tile
   * @param {number} y - y position of the tile
   * @param {number} tileset - the index of the tileset
   */
  getGid( x, y, tileset = 0 ) {
    if ( x < 0 || y < 0 ) {
      return -1;
    }
    const currentTileset = this.tilesets[tileset];
    const { width, height, firstGid } = currentTileset;
    if ( x >= width || y >= height ) {
      return -1;
    }
    return y * width + x + firstGid;
  }
}

export default TileData;
