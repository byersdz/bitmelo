import { Engine, libText } from '../../src/index';
import { Screen } from '../../lib/bitmelo.1.1.1.min';

console.log( Screen );
console.log( Engine );
console.log( libText );
/*
import { Engine } from '../../src/index';
import Screen from '../../src/Screen/Screen';
import Notes from '../../src/Audio/Notes';
import tileset from '../data/test.tileset.json';
import tileset2 from '../data/test2.tileset.json';
import './style.css';
import Sound from '../../src/Audio/Sound';

const position = {
  x: 0,
  y: 0,
};

const engine = new Engine();

engine.onInit = () => {
  engine.screen.hideCursor = true;
  engine.screen.scale = 4;
  engine.screen.scaleMode = Screen.SCALE_FIT_WINDOW;
  engine.tileData.addTileset( tileset );
  engine.tileData.addTileset( tileset2 );

  const testSound = {
    volumeTics: [
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      15,
      5,
      5,
      5,
      5,
      5,
      5,
    ],
    pitchTics: [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      8,
      8,
      0,
    ],
    arpTics: [
      0,
      0,
      0,
      0,
      0,
      8,
      8,
      8,
      8,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      8,
      8,
      8,
      8,
      0,
      0,
      8,
      8,
      0,
      0,
    ],
    wave: 0,
    useVolumeLoop: false,
    volumeLoopStart: 0,
    volumeLoopEnd: 31,
    usePitchLoop: true,
    pitchLoopStart: 28,
    pitchLoopEnd: 31,
    useArpLoop: false,
    arpLoopStart: 28,
    arpLoopEnd: 31,
    pitchScale: 400,
    releaseLength: 10,
    releaseMode: Sound.RELEASE_EXPO,
  };
  engine.audio.addSound( testSound );
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

  if ( engine.input.mouse.left.down ) {
    engine.audio.playSound( 0, Notes.C4, -1, 1, 0 );
  }
  else if ( engine.input.mouse.left.up ) {
    engine.audio.stopAllInfiniteSounds();
  }

  engine.screen.clear( 5 );
  engine.screen.drawLine( position.x, position.y, 100, 100, 4 );
  const color = engine.input.mouse.left.pressed ? 3 : 4;
  if ( !engine.input.mouse.isOffScreen ) {
    engine.screen.setPixel( engine.input.mouse.position.x, engine.input.mouse.position.y, color );
  }
  engine.screen.drawText( 'The quick, \u20acbrown! Fox jumps over the lazy. Dog.', 0, 100, 2, 1, 0 );
  engine.screen.drawChar( 'B'.charCodeAt( 0 ), 0, 0, 3 );

  // console.log( engine.realTimeSinceInit );
  // console.log( engine.realTimeSinceGameStart );
};

engine.begin();
*/
