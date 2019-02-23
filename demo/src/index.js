import { Engine } from '../../src/index';
import { SCALE_FIT_WINDOW } from '../../src/Screen/Screen';
import tileset from '../data/test.tileset.json';
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

  engine.screen.clear( 1 );
  engine.screen.drawLine( position.x, position.y, 100, 100, 4 );
  const color = engine.input.mouse.left.pressed ? 3 : 4;
  if ( !engine.input.mouse.isOffScreen ) {
    engine.screen.setPixel( engine.input.mouse.position.x, engine.input.mouse.position.y, color );
  }
  for ( let x = 0; x < 20; x += 1 ) {
    for ( let y = 0; y < 20; y += 1 ) {
      engine.screen.drawTile( ( x % 16 ) + 1, position.x + x * 16, position.y + y * 16 );
      // engine.screen.drawTile( 14, position.x + x * 16, position.y + y * 16 );
      // engine.screen.drawTile( 13, position.x + x * 16, position.y + y * 16 );
      // engine.screen.drawTile( 12, position.x + x * 16, position.y + y * 16 );
    }
  }
};

engine.begin();
