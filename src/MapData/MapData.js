import TileMap from './TileMap';

/**
 * Holds all of the Tile Map data.
 */
class MapData {
  constructor() {
    /**
     * Array of TileMap objects
     */
    this.tileMaps = [];
  }

  /**
   * Add a tilemap from a data object
   * @param {Object} tileMap - The tile map data
   */
  addTileMap( tileMap ) {
    this.tileMaps.push( new TileMap( tileMap ) );
    return this.tileMaps.length - 1;
  }

  /**
   * Get the tile GID at a given position
   * @param {number} x - The x position
   * @param {number} y - The y position
   * @param {number} tileMap - The index of the tile map you are checking
   * @param {number} layer - The index of the layer on the tile map you are checking
   */
  getTile( x, y, tileMap = 0, layer = 0 ) {
    if ( tileMap < 0 || tileMap >= this.tileMaps.length ) {
      return -1;
    }

    return this.tileMaps[tileMap].getTile( x, y, layer );
  }

  /**
   * Set the tile GID at a given position
   * @param {*} gid - The gid
   * @param {*} x - The x position
   * @param {*} y - The y position
   * @param {*} tileMap - The index of the tile map you are setting
   * @param {*} layer - The index of the layer on the tile map you are setting
   */
  setTile( gid, x, y, tileMap = 0, layer = 0 ) {
    if ( tileMap < 0 || tileMap >= this.tileMaps.length ) {
      return;
    }

    this.tileMaps[tileMap].setTile( gid, x, y, layer );
  }
}

export default MapData;
