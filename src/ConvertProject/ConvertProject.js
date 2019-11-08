
class ConvertProject {
  static projectToGameScript( projectData ) {
    const { project } = projectData;
    const { scripts } = projectData.code;
    const { sounds } = projectData.sound;
    const { tilesets } = projectData.tileset;
    const { tilemaps } = projectData.tilemap;

    const palette = projectData.palette.colors;

    const convertedTilesets = ConvertProject.convertProjectTilesets( tilesets, project.tileSize );
    const tilesetsString = JSON.stringify( convertedTilesets );

    const convertedTilemaps = ConvertProject.convertProjectTilemaps( tilemaps );
    const tilemapsString = JSON.stringify( convertedTilemaps );

    let scriptsString = '';

    for ( let i = 0; i < scripts.length; i += 1 ) {
      scriptsString += scripts[i].text;
    }

    const paletteString = JSON.stringify( palette );

    const soundsString = JSON.stringify( sounds );

    return `
  const engine = new bitmelo.Engine();

  engine.clickToBegin = ${ project.misc.clickToBegin };
  engine.startTransitionFrames = ${ project.misc.startTransitionFrames };

  engine.screen.width = ${ project.screen.width };
  engine.screen.height = ${ project.screen.height };

  engine.screen.scaleMode = ${ project.screen.scaleMode };
  engine.screen.scale = ${ project.screen.scale };
  engine.screen.minScale = ${ project.screen.minScale };
  engine.screen.maxScale = ${ project.screen.maxScale };
  engine.screen.horizontalScaleCushion = ${ project.screen.horizontalScaleCushion };
  engine.screen.verticalScaleCushion = ${ project.screen.verticalScaleCushion };
  engine.screen.rescaleOnWindowResize = ${ project.screen.rescaleOnWindowResize };

  engine.screen.hideCursor = ${ project.misc.hideCursor };

  engine.screen.setPalette(${ paletteString });

  engine.tileData.tileSize = ${ project.tileSize };

  const tilesets = ${ tilesetsString };
  for( let i = 0; i < tilesets.length; i += 1 ) {
    engine.tileData.addTileset( tilesets[i] );
  }

  const tilemaps = ${ tilemapsString };
  for( let i = 0; i < tilemaps.length; i += 1 ) {
    engine.mapData.addTileMap( tilemaps[i] );
  }

  const sounds = ${ soundsString };
  for( let i = 0; i < sounds.length; i += 1 ) {
    engine.audio.addSound( sounds[i] );
  }

  ${ scriptsString }

  engine.begin();
  `;
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
