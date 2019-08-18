import Screen from '../Screen/Screen';
import Input from '../Input/Input';
import TileData from '../TileData/TileData';
import MapData from '../MapData/MapData';
import FontData from '../FontData/FontData';
import Audio from '../Audio/Audio';

import standardFont from '../FontData/standard.font.json';
import smallFont from '../FontData/small.font.json';

class Engine {
  constructor() {
    /**
     * The id of the div that the engine will be contained by
     */
    this.containerId = 'bitmelo-container';

    /**
     * Function to be called when the engine is initialized
     */
    this.onInit = null;

    /**
     * Function to draw the initial screen when the engine loads.
     * Only seen when clickToBegin is true
     */
    this.onDrawStartScreen = null;

    /**
     * Function to draw the transition frames after start click.
     * Only seen when clickToBegin is true
     */
    this.onUpdateStartTransition = null;

    /**
     * Number of frames to show after begin click before the game starts.
     * Only relevant when clickToBegin is true.
     */
    this.startTransitionFrames = 60;

    /**
     * Function to be called every update of the engine.
     * Perform game logic and rendering here.
     */
    this.onUpdate = null;

    /**
     * Should we require the user to click the screen before the game starts?
     * This stops a game from automatically starring in a web page which can be annoying.
     */
    this.clickToBegin = true;

    /**
     * Instance of the Screen class used by the Engine. Automatically created by the engine.
     */
    this.screen = new Screen();

    /**
     * Instance of the Input class used by the Engine. Automatically created by the engine.
     */
    this.input = new Input();

    /**
     * Instance of the TileData class used by the Engine. Automatically created by the engine
     */
    this.tileData = new TileData();

    /**
     * Instance of the MapData class used by the Engine. Automatically created by the engine
     */
    this.mapData = new MapData();

    /**
     * Instance of the FontData class used by the Engine. Automatically created by the engine.
     * The Standard font is automatically added at index 0.
     * The Small font is automatically added at index 1.
     */
    this.fontData = new FontData();

    /**
     * Instance of the Audio class used by the Engine. Automatically created by the engine.
     */
    this.audio = new Audio();

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

    this.screen.conainerId = this.containerId;
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
        this.screen.clear( 1 );
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
          this.audio.init();
          this.input.clearInput();
          requestAnimationFrame( this._update );
        }
      } );
    }
    else {
      this._hasBegun = true;
      this.audio.init();
      requestAnimationFrame( this._update );
    }
  }

  /**
   * Game loop
   */
  _update() {
    this.input.pollInput();

    if ( this.clickToBegin && this.startTransitionFrames > 0 ) {
      this.startTransitionFrames -= 1;
      if ( this.onUpdateStartTransition ) {
        this.clearInput();
        this.onUpdateStartTransition();
      }
      else {
        this.screen.clear( 1 );
      }
    }
    else if ( this.onUpdate ) {
      this.onUpdate();
      this.audio.update();
    }

    this.screen.drawScreen();
    requestAnimationFrame( this._update );
  }
}

export default Engine;
