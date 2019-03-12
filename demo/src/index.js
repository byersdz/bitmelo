import { Engine } from '../../src/index';
import { SCALE_FIT_WINDOW } from '../../src/Screen/Screen';
import tileset from '../data/test.tileset.json';
import tileset2 from '../data/test2.tileset.json';
import tileMap from '../data/test.map.json';
import standardFont from '../data/standard-font.font.json';

// import { GAME_RIGHT } from '../../src/Input/Input';

import './style.css';

const position = {
  x: 0,
  y: 0,
};

const engine = new Engine();

let count = 10;
let increment = 1;

engine.onInit = () => {
  engine.screen.hideCursor = true;
  engine.screen.scale = 4;
  engine.screen.scaleMode = SCALE_FIT_WINDOW;
  engine.tileData.addTileset( tileset );
  engine.tileData.addTileset( tileset2 );
  engine.mapData.addTileMap( tileMap );
  engine.fontData.addFont( standardFont );
  console.log( engine.fontData );
};

engine.onUpdate = () => {
  if ( engine.input.left.pressed ) {
    position.x -= 1;
  }
  if ( engine.input.right.pressed ) {
    position.x += 1;
  }
  if ( engine.input.up.pressed ) {
    position.y += 1;
  }
  if ( engine.input.down.pressed ) {
    position.y -= 1;
  }

  if ( count >= 100 ) {
    increment = -1;
  }
  else if ( count <= 1 ) {
    increment = 1;
  }

  count += increment;

  engine.screen.clear( 5 );
  engine.screen.drawLine( position.x, position.y, 100, 100, 4 );
  const color = engine.input.mouse.left.pressed ? 3 : 4;
  if ( !engine.input.mouse.isOffScreen ) {
    engine.screen.setPixel( engine.input.mouse.position.x, engine.input.mouse.position.y, color );
  }
  engine.screen.drawMap( 0, 0, 40, 40, position.x, position.y );
  // engine.screen.drawMap( 0, 0, 40, 40, 0, 0, 0, 1 );
  engine.screen.drawText( 'The quick, brown! Fox jumps over the lazy. Dog.', 0, 100, 2, 1 );
  engine.screen.drawChar( 'B'.charCodeAt( 0 ), 0, 0, 3 );
};

engine.begin();
