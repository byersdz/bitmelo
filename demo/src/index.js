import { Engine } from '../../src/index';

import './style.css';

const position = {
  x: 0,
  y: 0,
};

const engine = new Engine();

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

  engine.screen.clear( 1 );
  engine.screen.setPixel( position.x, position.y, 2 );
};

engine.begin();
