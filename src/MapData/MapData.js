import TileMap from './TileMap';

class MapData {
  constructor() {
    this.tileMaps = [];
  }

  addTileMap( tileMap ) {
    this.tileMaps.push( new TileMap( tileMap ) );
    console.log( this.tileMaps );
    return this.tileMaps.length - 1;
  }

  getTile( x, y, tileMap = 0, layer = 0 ) {
    return this.tileMaps[tileMap].getTile( x, y, layer );
  }

  setTile( gid, x, y, tileMap = 0, layer = 0 ) {
    this.tileMaps[tileMap].setTile( gid, x, y, layer );
  }
}

export default MapData;
