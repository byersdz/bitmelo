import Screen from '../Screen/Screen';
import Input from '../Input/Input';
import TileData from '../TileData/TileData';
import MapData from '../MapData/MapData';
import FontData from '../FontData/FontData';

import standardFont from '../FontData/standard.font.json';
import smallFont from '../FontData/small.font.json';

class Engine {
  constructor() {
    this.containerId = 'minnow-container';
    this.onInit = null;
    this.onDrawStartScreen = null;
    this.onUpdate = null;
    this.clickToBegin = true;
    this.screen = new Screen();
    this.input = new Input();
    this.tileData = new TileData();
    this.mapData = new MapData();
    this.fontData = new FontData();

    this.fontData.addFont( standardFont );
    this.fontData.addFont( smallFont );

    this._hasBegun = false;
    this._update = this._update.bind( this );
  }

  /**
   * Begin running the engine. This will perform initial setup, call the onInit function, and begin the game loop
   */
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
    this.screen.mapData = this.mapData;
    this.screen.fontData = this.fontData;

    if ( this.clickToBegin ) {
      if ( this.onDrawStartScreen ) {
        this.onDrawStartScreen();
      }
      else {
        this.screen.clear( 5 );
        this.screen.drawText( 'Click to begin...', 10, 10, 2, 1, 0 );
      }
      const screenHidesCursor = this.screen.hideCursor;
      this.screen.hideCursor = false;
      this.screen._setCanvasStyle();
      this.screen.drawScreen();
      this.screen.canvas.addEventListener( 'click', () => {
        if ( !this._hasBegun ) {
          this._hasBegun = true;
          this.screen.hideCursor = screenHidesCursor;
          this.screen._setCanvasStyle();
          requestAnimationFrame( this._update );
        }
      } );
    }
    else {
      this._hasBegun = true;
      requestAnimationFrame( this._update );
    }
  }

  /**
   * Game loop
   */
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
