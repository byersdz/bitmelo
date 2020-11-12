/* eslint-disable prefer-destructuring */
import Screen from '../Screen/Screen';
import Input from '../Input/Input';
import TileData from '../TileData/TileData';
import MapData from '../MapData/MapData';
import FontData from '../FontData/FontData';
import Audio from '../Audio/Audio';
import ConvertProject from '../ConvertProject/ConvertProject';

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

    /**
     * The number of seconds since init was called
     */
    this.realTimeSinceInit = 0;

    /**
     * The number of seconds since the game was started
     */
    this.realTimeSinceGameStart = 0;

    this.fontData.addFont( standardFont );
    this.fontData.addFont( smallFont );

    this._hasBegun = false;
    this._update = this._update.bind( this );
    this._initTime = 0;
    this._gameStartTime = 0;
    this._frameStartTime = new Date().getTime();

    /**
     * Whether we have detected a condition that should stop the games execution.
     * Likely from an infinite loop.
     */
    this._didCrash = false;

    /**
     * How many milliseconds an update frame can run until the game crashes.
     * This is to stop an infinite loop from locking up the browser forever.
     */
    this._msToFrameCrash = 5000;
  }

  /**
   * Add project data from the Bitmelo Editor to the engine
   */
  addProjectData( projectData ) {
    let format = 'project';
    if ( projectData.format ) {
      format = projectData.format;
    }

    let project = null;
    let sounds = null;
    let tilesets = null;
    let tilemaps = null;
    let palette = null;

    if ( format === 'transfer' ) {
      project = projectData.project;
      sounds = projectData.sounds;
      tilesets = projectData.tilesets;
      tilemaps = projectData.tilemaps;
      palette = projectData.palette;
    }
    else {
      project = projectData.project;
      sounds = projectData.sound.sounds;
      tilesets = projectData.tileset.tilesets;
      tilemaps = projectData.tilemap.tilemaps;
      palette = projectData.palette;
    }

    // engine settings
    this.clickToBegin = project.misc.clickToBegin;
    this.startTransitionFrames = project.misc.startTransitionFrames;

    // screen settings
    this.screen.width = project.screen.width;
    this.screen.height = project.screen.height;
    this.screen.scaleMode = project.screen.scaleMode;
    this.screen.scale = project.screen.scale;
    this.screen.minScale = project.screen.minScale;
    this.screen.maxScale = project.screen.maxScale;
    this.screen.horizontalScaleCushion = project.screen.horizontalScaleCushion;
    this.screen.verticalScaleCushion = project.screen.verticalScaleCushion;
    this.screen.rescaleOnWindowResize = project.screen.rescaleOnWindowResize;
    this.screen.hideCursor = project.misc.hideCursor;
    this.screen.setPalette( palette.colors );

    // tilesets
    this.tileData.tileSize = project.tileSize;
    const convertedTilesets = ConvertProject.convertProjectTilesets( tilesets, project.tileSize );
    for ( let i = 0; i < convertedTilesets.length; i += 1 ) {
      this.tileData.addTileset( convertedTilesets[i] );
    }

    // tilemaps
    const convertedTilemaps = ConvertProject.convertProjectTilemaps( tilemaps );
    for ( let i = 0; i < convertedTilemaps.length; i += 1 ) {
      this.mapData.addTileMap( convertedTilemaps[i] );
    }

    // sounds
    for ( let i = 0; i < sounds.length; i += 1 ) {
      this.audio.addSound( sounds[i] );
    }
  }

  /**
   * Begin running the engine. This will perform initial setup, call the onInit function, and begin the game loop
   */
  begin() {
    const date = new Date();
    this._initTime = date.getTime();
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

    if ( this._didCrash ) {
      this.screen.clear( 1 );
      this.screen.drawText( 'Game Crashed', 10, 10, 2, 1, 0 );
      this.screen._setCanvasStyle();
      this.screen.drawScreen();
      return;
    }

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
      this._gameStartTime = date.getTime();
      this._hasBegun = true;
      this.audio.init();
      requestAnimationFrame( this._update );
    }
    this._didCrash = false;
  }

  /**
   * Game loop
   */
  _update() {
    const date = new Date();
    this._frameStartTime = date.getTime();
    const msSinceInit = date.getTime() - this._initTime;
    this.realTimeSinceInit = msSinceInit / 1000;

    this.input.pollInput();

    // the first game frame after transition
    if ( this.clickToBegin && this.startTransitionFrames === 0 ) {
      this._gameStartTime = date.getTime();
      this.startTransitionFrames -= 1;
    }

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
      this.realTimeSinceGameStart = ( date.getTime() - this._gameStartTime ) / 1000;
      this.onUpdate();
      this.audio.update();
    }

    this.screen.drawScreen();

    if ( this._didCrash ) {
      this.screen.clear( 1 );
      this.screen.drawText( 'Game Crashed', 10, 10, 2, 1, 0 );
      this.screen.drawScreen();
    }
    else {
      requestAnimationFrame( this._update );
    }
  }

  /**
   * Should we break out of a loop?
   * This is used by instrumented code in case a frame is taking long enough that
   * the game should crash instead of locking up the browser.
   */
  shouldBreak() {
    if ( this._didCrash ) {
      return true;
    }

    const currentTime = new Date().getTime();
    const msSinceFrameStart = currentTime - this._frameStartTime;
    if ( msSinceFrameStart > this._msToFrameCrash ) {
      this._didCrash = true;
      return true;
    }

    return false;
  }
}

export default Engine;
