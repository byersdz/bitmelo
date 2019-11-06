
class ConvertProject {
  static projectToGameScript( projectData ) {
    console.log( projectData );
  }

  static convertProjectTilemaps( projectTilemaps ) {
    const tilemaps = [];

    for ( let i = 0; i < projectTilemaps.length; i += 1 ) {
      const tilemap = {};
      tilemap.width = projectTilemaps[i].width;
      tilemap.height = projectTilemaps[i].height;
      tilemap.name = projectTilemaps[i].name;
      tilemap.layers = [];

      for ( let j = 0; j < projectTilemaps[i].layers.length; j += 1 ) {
        tilemap.layers.push( ...[projectTilemaps[i].layers[j].data] );
      }

      tilemaps.push( tilemap );
    }

    return tilemaps;
  }

  static convertProjectTilesets( projectTilesets, tileSize ) {
    const tilesets = [];

    for ( let i = 0; i < projectTilesets.length; i += 1 ) {
      const currentProjectTileset = projectTilesets[i];
      const tileset = {};
      tileset.data = ConvertProject.convertToTilesetArray(
        currentProjectTileset.layers[0].data,
        currentProjectTileset.width * tileSize,
        currentProjectTileset.height * tileSize,
        tileSize,
      );
      tileset.width = currentProjectTileset.width;
      tileset.height = currentProjectTileset.width;
      tileset.format = 'array';
      tileset.name = 'test';
      tileset.tileSize = tileSize;

      tilesets.push( tileset );
    }
    return tilesets;
  }

  static convertToTilesetArray( sourceArray, width, height, tileSize ) {
    const imageData = new Array( width * height );
    const tileColumns = width / tileSize;

    for ( let i = 0; i < sourceArray.length; i += 1 ) {
      const x = i % width;
      const y = Math.floor( i / width );
      const tileX = Math.floor( x / tileSize );
      const tileY = Math.floor( y / tileSize );

      const iPerTile = tileSize * tileSize;
      const startIndex = tileY * iPerTile * tileColumns + ( tileX * iPerTile ); // the starting index of the current tile

      // relative x and y from the tile origin
      const relativeX = x - ( tileX * tileSize );
      const relativeY = y - ( tileY * tileSize );

      const destinationIndex = startIndex + ( relativeY * tileSize ) + relativeX;
      imageData[destinationIndex] = sourceArray[i];
    }

    return imageData;
  }
}

export default ConvertProject;
