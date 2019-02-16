
/**
 * Represents a game screen for low resolution games.
 * Has simple drawing functions using an indexed palette of a maximum of 256 colors
 * The origin (0, 0) position of the screen is on the bottom left
 */
class Screen {
  constructor() {
    this.width = 320;
    this.height = 180;
    this.scale = 3;
    this.transparentPaletteIndex = 0;

    this._canvas = null;
    this._context = null;
    this._screenData = null;
    this._palette = null;
    this._generatedPalette = null;

    this._isLittleEndian = true;
  }

  /**
   * Do initial setup such as creating the canvas and building the palette
   */
  init() {
    const container = document.createElement( 'div' );
    container.id = 'main-container';

    this._canvas = document.createElement( 'canvas' );
    this._canvas.setAttribute( 'id', 'game-device' );
    this._canvas.setAttribute( 'width', this.width );
    this._canvas.setAttribute( 'height', this.height );

    let canvasStyle = `width: ${ this.width * this.scale }px;`;
    canvasStyle += `height: ${ this.height * this.scale }px;`;
    canvasStyle += 'image-rendering: -webkit-optimize-contrast;';
    canvasStyle += 'image-rendering: crisp-edges;';
    canvasStyle += 'image-rendering: pixelated;';

    this._canvas.setAttribute( 'style', canvasStyle );

    container.appendChild( this._canvas );
    document.body.appendChild( container );

    this._context = this._canvas.getContext( '2d' );

    this._screenData = new Uint8ClampedArray( this.width * this.height );

    // check if we are little endian
    const buffer = new ArrayBuffer( 4 );
    const test8 = new Uint8ClampedArray( buffer );
    const test32 = new Uint32Array( buffer );
    test32[0] = 0x0a0b0c0d;

    if ( test8[0] === 0x0a
      && test8[1] === 0x0b
      && test8[2] === 0x0c
      && test8[3] === 0x0d
    ) {
      this._isLittleEndian = false;
    }

    if ( !this._palette ) {
      // set the default palette
      this._palette = [
        [0x00, 0x00, 0x00],
        [0x00, 0x00, 0x00],
        [0xff, 0xff, 0xff],
        [0xff, 0x00, 0x00],
        [0x00, 0xff, 0x00],
        [0x00, 0x00, 0xff],
      ];
    }

    this._buildPalette();
  }

  /**
   * Set the palette that will used by the Screen.
   * All colors are drawn fully opaque exept for the palette index specified at {@link transparentPaletteIndex}
   *
   * @example
   * const palette = [
   *  [0, 0, 0], // black, by default the 0 index is transparent
   *  [0, 0, 0], // black
   *  [255, 255, 255], // white
   *  [255, 0, 0], // red
   *  [0, 255, 0], // green
   *  [0, 0, 255] // blue
   * ];
   *
   * screen.setPalette( palette );
   *
   * @param {Array.<Array.<number>} palette - The array of colors to be used by the screen.
   * Each index should be a color described by an array of 3 integers in rgb order.
   * Each integer has a min value of 0 and a max value of 255.
   */
  setPalette( palette ) {
    this._palette = palette;
    this._buildPalette();
  }

  /**
   * Change a single palette color
   *
   * @param {number[]} color - The color we want to add
   * @param {number} index - this palette index we want to set
   */
  setPaletteColorAtIndex( color, index ) {
    this._palette[index] = color;
    this._buildPalette();
  }

  /**
   * Build the palette by converting _palette to the _generatedPalette we will be using internally
   */
  _buildPalette() {
    this._generatedPalette = new Uint32Array( this._palette.length );
    let currentColor = null;
    if ( this._isLittleEndian ) {
      for ( let i = 0; i < this._palette.length; i += 1 ) {
        currentColor = this._palette[i];
        this._generatedPalette[i] = (
          ( 255 << 24 ) // a
          | ( currentColor[2] << 16 ) // b
          | ( currentColor[1] << 8 ) // g
          | currentColor[0] // r
        );
      }
    }
    else {
      for ( let i = 0; i < this._palette.length; i += 1 ) {
        currentColor = this._palette[i];
        this._generatedPalette[i] = (
          ( currentColor[0] << 24 ) // r
          | ( currentColor[1] << 16 ) // g
          | ( currentColor[2] << 8 ) // b
          | 255 // a
        );
      }
    }
  }

  /**
   * Set a pixel on the screen.
   * The origin (0, 0) of the screen is on the bottom left
   * @param {number} x - x position
   * @param {number} y - y position
   * @param {number} paletteId - palette color index
   */
  setPixel( x, y, paletteId ) {
    if ( x < 0 || x >= this.width || y < 0 || y >= this.height ) {
      return;
    }
    this._screenData[y * this.width + x] = paletteId;
  }

  /**
   * Set a pixel on the screen, without doing any bounds checking
   * @param {number} x - x position
   * @param {number} y - y position
   * @param {number} paletteId - palette color index
   */
  setPixelUnsafe( x, y, paletteId ) {
    this._screenData[y * this.width + x] = paletteId;
  }

  /**
   * Get the pallete index at a given position on the screen
   * @param {*} x - x position
   * @param {*} y - y position
   */
  getPixel( x, y ) {
    return this._screenData[y * this.width + x];
  }

  /**
   * Fill the screen with the given palette index
   * @param {*} paletteId - the palette index / defaults to 0 if unspecified
   */
  clear( paletteId ) {
    if ( paletteId ) {
      this._screenData.fill( paletteId );
    }
    else {
      this._screenData.fill( 0 );
    }
  }

  /**
   * Draw a line between 2 positions
   * @param {*} x1 - first x position
   * @param {*} y1 - first y position
   * @param {*} x2 - second x position
   * @param {*} y2 - second y position
   * @param {*} id - palette index to be drawn
   */
  drawLine( x1, y1, x2, y2, id ) {
    if ( x1 === x2 && y1 === y2 ) {
      // same coordinate, draw a pixel
      this.setPixel( x1, x2, id );
      return;
    }

    if ( Math.abs( y2 - y1 ) < Math.abs( x2 - x1 ) ) {
      // slope is less than 1
      if ( x1 > x2 ) {
        this._drawLineLow( x2, y2, x1, y1, id );
      }
      else {
        this._drawLineLow( x1, y1, x2, y2, id );
      }
    }
    else {
      // slope is greater than 1
      if ( y1 > y2 ) {
        this._drawLineHigh( x2, y2, x1, y1, id );
      }
      else {
        this._drawLineHigh( x1, y1, x2, y2, id );
      }
    }
  }

  /**
   * Draw a line with a slope less than or equal to 1
   */
  _drawLineLow( x1, y1, x2, y2, id ) {
    const dx = x2 - x1;
    let dy = y2 - y1;
    let yIncrement = 1;
    if ( dy < 0 ) {
      yIncrement = -1;
      dy = -dy;
    }

    let decision = 2 * dy - dx;
    let y = y1;

    for ( let x = x1; x <= x2; x += 1 ) {
      this.setPixel( x, y, id );

      if ( decision > 0 ) {
        y += yIncrement;
        decision = decision - ( 2 * dx );
      }

      decision = decision + ( 2 * dy );
    }
  }

  /**
   * Draw a line with a slope greater than 1
   */
  _drawLineHigh( x1, y1, x2, y2, id ) {
    let dx = x2 - x1;
    const dy = y2 - y1;
    let xIncrement = 1;
    if ( dx < 0 ) {
      xIncrement = -1;
      dx = -dx;
    }

    let decision = 2 * dx - dy;
    let x = x1;

    for ( let y = y1; y <= y2; y += 1 ) {
      this.setPixel( x, y, id );

      if ( decision > 0 ) {
        x += xIncrement;
        decision = decision - ( 2 * dy );
      }

      decision = decision + ( 2 * dx );
    }
  }

  /**
   * draw the data from {@link _screenData} to the canvas
   */
  drawScreen() {
    const imageData = this._context.getImageData( 0, 0, this.width, this.height );
    const buffer = new ArrayBuffer( imageData.data.length );
    const data8 = new Uint8ClampedArray( buffer );
    const data32 = new Uint32Array( buffer );

    let index = 0;
    let screenY = 0;
    for ( let y = 0; y < this.height; y += 1 ) {
      for ( let x = 0; x < this.width; x += 1 ) {
        screenY = this.height - y - 1; // origin from top left to bottom left
        index = this._screenData[screenY * this.width + x];
        data32[y * this.width + x] = this._generatedPalette[index];
      }
    }
    imageData.data.set( data8 );
    this._context.putImageData( imageData, 0, 0 );
  }
}

export default Screen;
