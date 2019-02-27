import TileMap from './TileMap';

class MapData {
  constructor() {
    this.tileMaps = [];
  }

  addTileMap( tileMap ) {
    this.tileMaps.push( new TileMap( tileMap ) );
    return this.tileMaps.length - 1;
  }
}

export default MapData;
