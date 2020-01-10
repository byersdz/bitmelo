import ConvertData from '../ConvertData/ConvertData';

class ConvertProject {
  static convertProjectTilemaps( projectTilemaps ) {
    const tilemaps = [];

    for ( let i = 0; i < projectTilemaps.length; i += 1 ) {
      const tilemap = {};
      tilemap.width = projectTilemaps[i].width;
      tilemap.height = projectTilemaps[i].height;
      tilemap.name = projectTilemaps[i].name;
      tilemap.layers = [];

      for ( let j = 0; j < projectTilemaps[i].layers.length; j += 1 ) {
        const currentLayer = projectTilemaps[i].layers[j];
        const format = currentLayer.format ? currentLayer.format : 'array';

        if ( format === 'rc' ) {
          // run and compressed string
          const runData = ConvertData.compressedStringToArray( currentLayer.data );
          tilemap.layers.push( ConvertData.runToArray( runData ) );
        }
        else if ( format === 'c' ) {
          // compressed string
          tilemap.layers.push( ConvertData.compressedStringToArray( currentLayer.data ) );
        }
        else if ( format === 'run' ) {
          // run length encoding
          tilemap.layers.push( ConvertData.runToArray( currentLayer.data ) );
        }
        else {
          // array
          tilemap.layers.push( ...[currentLayer.data] );
        }
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
      const layerData = [];

      for ( let j = 0; j < currentProjectTileset.layers.length; j += 1 ) {
        const currentLayer = currentProjectTileset.layers[j];
        if ( currentLayer.isVisible ) {
          let dataArray = null;

          const format = currentLayer.format ? currentLayer.format : 'array';

          if ( format === 'rc' ) {
            // run and compressed string
            const runArray = ConvertData.compressedStringToArray( currentLayer.data );
            dataArray = ConvertProject.convertToTilesetArray(
              ConvertData.compressedStringToArray( runArray ),
              currentProjectTileset.width * tileSize,
              currentProjectTileset.height * tileSize,
              tileSize,
            );
          }
          else if ( format === 'c' ) {
            // compressed string
            dataArray = ConvertProject.convertToTilesetArray(
              ConvertData.compressedStringToArray( currentLayer.data ),
              currentProjectTileset.width * tileSize,
              currentProjectTileset.height * tileSize,
              tileSize,
            );
          }
          else if ( format === 'run' ) {
            // run length encoding
            dataArray = ConvertProject.convertToTilesetArray(
              ConvertData.runToArray( currentLayer.data ),
              currentProjectTileset.width * tileSize,
              currentProjectTileset.height * tileSize,
              tileSize,
            );
          }
          else {
            // array
            dataArray = ConvertProject.convertToTilesetArray(
              currentLayer.data,
              currentProjectTileset.width * tileSize,
              currentProjectTileset.height * tileSize,
              tileSize,
            );
          }

          layerData.push( dataArray );
        }
      }

      // flatten the layer data into 1 layer, ignoring transparent pixels
      if ( layerData.length > 0 ) {
        tileset.data = new Array( layerData[0].length );
        tileset.data.fill( 0 );
        for ( let position = 0; position < layerData[0].length; position += 1 ) {
          for ( let layer = 0; layer < layerData.length; layer += 1 ) {
            const currentValue = layerData[layer][position];
            if ( currentValue ) {
              tileset.data[position] = currentValue;
              break;
            }
          }
        }
      }
      else {
        tileset.data = new Array( currentProjectTileset.width * currentProjectTileset.height * tileSize * tileSize );
        tileset.data.fill( 0 );
      }

      tileset.width = currentProjectTileset.width;
      tileset.height = currentProjectTileset.height;
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
