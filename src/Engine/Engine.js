import Screen from '../Screen/Screen';
import Input from '../Input/Input';
import TileData from '../TileData/TileData';

class Engine {
  constructor() {
    this.containerId = 'minnow-container';
    this.onInit = null;
    this.onUpdate = null;
    this.screen = new Screen();
    this.input = new Input();
    this.tileData = new TileData();

    this._update = this._update.bind( this );
  }

  begin() {
    if ( this.onInit ) {
      this.onInit();
    }

    this.screen.init();
    this.screen.onScaleChange = ( scale ) => {
      this.input.canvasScale = scale;
    };

    this.input.canvas = this.screen.canvas;
    this.input.canvasScale = this.screen.scale;
    this.input.screenWidth = this.screen.width;
    this.input.screenHeight = this.screen.height;
    this.input.init();
    this.tileData.init();
    this.screen.tileData = this.tileData;
    requestAnimationFrame( this._update );
  }

  _update() {
    this.input.pollInput();

    if ( this.onUpdate ) {
      this.onUpdate();
    }

    this.screen.drawScreen();
    requestAnimationFrame( this._update );
  }
}

export default Engine;
