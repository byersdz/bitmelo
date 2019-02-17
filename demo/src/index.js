import { Engine } from '../../src/index';

import './style.css';

const position = {
  x: 100,
  y: 100,
};

const engine = new Engine();

let count = 10;
let increment = 1;
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
  const radius = count;
  engine.screen.drawCircle( position.x, position.y, radius, 4 );
  engine.screen.drawCircleBorder( position.x, position.y, radius, 5 );
  engine.screen.drawCircleBorder( position.x, position.y, radius - 2, 3 );
};

engine.begin();
