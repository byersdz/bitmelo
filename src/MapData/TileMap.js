
/**
 * Represents a Tile Map.
 */
class TileMap {
  constructor( data ) {
    /**
     * The name of the Tile Map
     */
    this.name = '';
    /**
     * The number of columns in the Tile Map
     */
    this.width = 0;
    /**
     * The number of rows in the Tile Map
     */
    this.height = 0;

    /**
     * Array of layer data
     */
    this.layers = [];

    if ( data ) {
      this.name = data.name;
      this.width = data.width;
      this.height = data.height;

      if ( data.layers ) {
        for ( let i = 0; i < data.layers.length; i += 1 ) {
          this.layers.push( this._getTypedArrayFromDataLayer( data.layers[i] ) );
        }
      }
    }
  }

  /**
   * Convert an array of numbers into a Uint16Array
   * @param {number[]} dataLayer
   */
  _getTypedArrayFromDataLayer( dataLayer ) {
    const result = new Uint16Array( this.width * this.height );
    for ( let i = 0; i < dataLayer.length; i += 1 ) {
      result[i] = dataLayer[i];
    }
    return result;
  }

  /**
   * Get the tile GID at a given position
   * @param {number} x - The x position
   * @param {number} y - The y position
   * @param {number} layer - The index of the layer on the tile map you are checking
   */
  getTile( x, y, layer = 0 ) {
    const currentLayer = this.layers[layer];
    const index = y * this.width + x;
    return currentLayer[index];
  }

  /**
   * Set the tile GID at a given position
   * @param {*} gid - The gid
   * @param {*} x - The x position
   * @param {*} y - The y position
   * @param {*} layer - The index of the layer on the tile map you are setting
   */
  setTile( gid, x, y, layer = 0 ) {
    const currentLayer = this.layers[layer];
    const index = y * this.width + x;
    currentLayer[index] = gid;
  }
}

export default TileMap;
