import { ConvertProject, Engine } from '../../src/index';
import testProject from '../data/WelcomeDemo.project.json';
import './style.css';

const { project } = testProject;
const { tilesets } = testProject.tileset;
const { tilemaps } = testProject.tilemap;

const convertedTilesets = ConvertProject.convertProjectTilesets( tilesets, project.tileSize );
const convertedTilemaps = ConvertProject.convertProjectTilemaps( tilemaps );

const engine = new Engine();
engine.clickToBegin = false;

for ( let i = 0; i < convertedTilesets.length; i += 1 ) {
  engine.tileData.addTileset( convertedTilesets[i] );
}

for ( let i = 0; i < convertedTilemaps.length; i += 1 ) {
  engine.mapData.addTileMap( convertedTilemaps[i] );
}

let hasDrawn = false;
engine.onUpdate = () => {
  if ( !hasDrawn ) {
    engine.screen.drawTile(
      28,
      0,
      0,
    );
    engine.screen.drawTile(
      1,
      16,
      0,
      0,
      270,
    );
    hasDrawn = true;
  }
};

engine.begin();
