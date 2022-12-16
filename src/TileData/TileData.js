
/**
 * Holds all of the tile data.
 */
class TileData {
  constructor() {
    /**
     * The size of each tile in pixels.
     * Used for both width and height.
     */
    this.tileSize = 16;
    /**
     * Array of tileset data.
     * All tiledata is added to this.data when init is called.
     * More tilesets can not be added after this.
     */
    this.tilesets = [];
    /**
     * All of the tile data in a single Uint8ClampedArray.
     * This is whats used by Screen to draw tiles.
     */
    this.data = null;
    /**
     * All of the flag data in a single Uint16Array.
     * Each item is a flag value for each tile.
     */
    this.flagData = null;
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
    this.flagData = new Uint16Array( numberOfTiles + 1 );
    this.flagData.fill( 0 );

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

      const { flags } = currentTileset;
      for ( let j = 0; j < flags.length; j += 1 ) {
        this.flagData[firstGid + j] = parseInt( flags[j], 10 );
      }

      firstGid += currentTileset.width * currentTileset.height;
      startPosition += currentTileset.width * currentTileset.height * this.tileSize * this.tileSize;

      // data is no longer needed in the current tileset as it has been added to this.data.
      delete currentTileset.data;

      // flags are no longer needed
      delete currentTileset.flags;
    }
  }

  /**
   * Add a tileset.
   * All tilesets must be added before init is called.
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

  /**
   * Get the tileset info for a given gid
   * @param {number} gid - the gid of the tile
   */
  getTilesetInfoForGid( gid ) {
    if ( !this.tilesets || this.tilesets.length === 0 || !gid ) {
      return null;
    }

    let tilesetIndex = 0;
    for ( let i = 0; i < this.tilesets.length; i += 1 ) {
      const tileset = this.tilesets[i];
      if ( tileset.firstGid <= gid ) {
        tilesetIndex = i;
      }
      else {
        break;
      }
    }

    return {
      firstGid: this.tilesets[tilesetIndex].firstGid,
      width: this.tilesets[tilesetIndex].width,
      height: this.tilesets[tilesetIndex].height,
      index: tilesetIndex,
    };
  }

  /**
   * Get the array data for a tile section
   * @param {number} gid - the gid of the bottom left tile
   * @param {number} tileWidth - the width in tiles of the tile section
   * @param {number} tileHeight - the height in tiles of the tile section
   */
  getTileSectionData( gid, tileWidth = 1, tileHeight = 1 ) {
    const tilesetInfo = this.getTilesetInfoForGid( gid );

    if ( !tilesetInfo ) {
      return null;
    }

    const { tileSize } = this;

    const localGid = gid - tilesetInfo.firstGid;
    const localY = Math.floor( localGid / tilesetInfo.width );
    const localX = localGid - localY * tilesetInfo.width;

    const data = new Uint8ClampedArray( tileWidth * tileHeight * tileSize * tileSize );
    const width = tileWidth * tileSize;
    const height = tileHeight * tileSize;

    for ( let tileY = 0; tileY < tileHeight; tileY += 1 ) {
      for ( let tileX = 0; tileX < tileWidth; tileX += 1 ) {
        if ( tileX + localX >= tilesetInfo.width || tileY + localY >= tilesetInfo.height ) {
          // tile is outside of tileset
          break;
        }

        const tileGid = localGid + tileY * tilesetInfo.width + tileX + tilesetInfo.firstGid;
        const basePosition = ( tileGid - 1 ) * tileSize * tileSize;
        for ( let y = 0; y < tileSize; y += 1 ) {
          for ( let x = 0; x < tileSize; x += 1 ) {
            const paletteId = this.data[basePosition + y * tileSize + x];
            const targetX = tileX * tileSize + x;
            const targetY = tileY * tileSize + y;
            data[targetY * width + targetX] = paletteId;
          }
        }
      }
    }

    return { data, width, height };
  }

  // getFlag( gid, flagNumber = 0 ) {

  // }
}

export default TileData;
