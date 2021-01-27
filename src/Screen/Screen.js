
import standardPalette from './standardPalette';

/**
 * Represents a game screen for low resolution games.
 * Has simple drawing functions using an indexed palette of a maximum of 256 colors
 * The origin (0, 0) position of the screen is on the bottom left
 */
class Screen {
  constructor() {
    /**
     * The id of the container div to make the Screen a child of
     */
    this.conainerId = 'bitmelo-container';
    /**
     * The dom object the Screen will be a child of.
     */
    this.container = null;
    /**
     * How many pixels wide is the screen?
     */
    this.width = 320;
    /**
     * How many pixels tall is the screen?
     */
    this.height = 180;
    /**
     * The scale of the pixels in the screen.
     */
    this.scale = 3;
    /**
     * Maximum scale of the screen.
     */
    this.maxScale = -1;
    /**
     * Minimum scale of the screen.
     */
    this.minScale = 1;
    /**
     * The scale mode of the screen.
     * Screen.SCALE_CONSTANT: 1,
     * Screen.SCALE_FIT_WINDOW: 2
     */
    this.scaleMode = Screen.SCALE_CONSTANT;

    /**
     * How many horizontal pixels to ignore when using a dynamic scale.
     */
    this.horizontalScaleCushion = 0;

    /**
     * How many vertical pixels to ignore when using a dynamic scale.
     */
    this.verticalScaleCushion = 0;

    /**
     * When using dynamic scaling, should we rescale when the window is resized?
     */
    this.rescaleOnWindowResize = true;

    /**
     * Should the cursor be hidden when placed over the screen?
     */
    this.hideCursor = false;

    /**
     * Reference to an instance of TileData used by the screen.
     */
    this.tileData = null;

    /**
     * Reference to an instance of MapData used by the screen.
     */
    this.mapData = null;

    /**
     * Reference to an instance of FontData used by the screen.
     */
    this.fontData = null;

    /**
     * Callback that is called whenever the scale is changed.
     * Used by the Engine to change values in the Input class.
     */
    this.onScaleChange = null;

    /**
     * The DOM canvas used by this screen.
     */
    this.canvas = null;

    /**
     * This mode runs the engine without drawing to a canvas or playing audio.
     * This is useful to use the engine to generate image data.
     */
    this.dataOnlyMode = false;

    /**
     * The canvas context used by this screen.
     */
    this._context = null;

    /**
     * The image data of the context.
     */
    this._imageData = null;

    /**
     * The pixel data drawn to using Screen methods such as setPixel or drawLine
     */
    this._screenData = null;

    /**
     * The palette data given by the user
     */
    this._palette = null;

    /**
     * Typed Array of paletted data generated from _palette and used by the Screen.
     */
    this._generatedPalette = null;

    /**
     * Does this computer use little endian formatting?
     */
    this._isLittleEndian = true;
  }

  /**
   * Do initial setup such as creating the canvas and building the palette
   */
  init() {
    if ( this.dataOnlyMode ) {
      this._screenData = new Uint8ClampedArray( this.width * this.height );
      if ( !this._palette ) {
        this._palette = standardPalette;
      }
      return;
    }

    this.container = document.getElementById( this.conainerId );

    this.canvas = document.createElement( 'canvas' );
    this.canvas.setAttribute( 'id', 'game-device' );
    this.canvas.setAttribute( 'width', this.width );
    this.canvas.setAttribute( 'height', this.height );

    this._setScale();

    if ( this.rescaleOnWindowResize && this.scaleMode !== Screen.SCALE_CONSTANT ) {
      window.onresize = () => {
        this._setScale();
        this._setCanvasStyle();
      };
    }

    this._setCanvasStyle();

    this.container.appendChild( this.canvas );

    this._context = this.canvas.getContext( '2d', { alpha: false } );
    this._context.imageSmoothingEnabled = false;
    this._screenData = new Uint8ClampedArray( this.width * this.height );
    this._imageData = this._context.getImageData( 0, 0, this.width, this.height );

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
      this._palette = standardPalette;
    }

    this._buildPalette();
  }

  /**
   * Sets the scale of the Screen.
   */
  _setScale() {
    if ( this.dataOnlyMode ) {
      return;
    }

    if ( this.scaleMode === Screen.SCALE_FIT_WINDOW ) {
      const maxWidth = window.innerWidth - this.horizontalScaleCushion;
      const maxHeight = window.innerHeight - this.verticalScaleCushion;

      const maxHorizScale = Math.floor( maxWidth / this.width );
      const maxVerticalScale = Math.floor( maxHeight / this.height );

      this.scale = maxHorizScale < maxVerticalScale ? maxHorizScale : maxVerticalScale;
      if ( this.scale < this.minScale ) {
        this.scale = this.minScale;
      }
      if ( this.maxScale > 0 && this.scale > this.maxScale ) {
        this.scale = this.maxScale;
      }
    }

    if ( this.onScaleChange ) {
      this.onScaleChange( this.scale );
    }
  }

  /**
   * Sets css styling on the container dom object.
   */
  _setCanvasStyle() {
    if ( this.dataOnlyMode ) {
      return;
    }

    let containerStyle = '';
    containerStyle += `width: ${ this.width * this.scale }px;`;
    containerStyle += `height: ${ this.height * this.scale }px;`;

    this.container.setAttribute( 'style', containerStyle );

    let canvasStyle = '';
    canvasStyle += 'transform-origin: 50% 0%;';
    canvasStyle += `transform: scale(${ this.scale });`;
    canvasStyle += 'image-rendering: -webkit-optimize-contrast;';
    canvasStyle += 'image-rendering: -moz-crisp-edges;';
    canvasStyle += 'image-rendering: crisp-edges;';
    canvasStyle += 'image-rendering: pixelated;';


    if ( this.hideCursor ) {
      canvasStyle += 'cursor: none';
    }

    this.canvas.setAttribute( 'style', canvasStyle );
  }

  /**
   * Set the palette that will used by the Screen.
   * All colors are drawn fully opaque exept for the palette index at 0 which is transparent
   *
   * @example
   * const palette = [
   *  '000000', // black, the 0 index is transparent
   *  '000000', // black
   *  'ffffff', // white
   *  'ff0000', // red
   *  '00ff00', // green
   *  '0000ff' // blue
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
        let r = 0;
        let g = 0;
        let b = 0;
        if ( typeof currentColor === 'string' ) {
          r = Number.parseInt( currentColor.slice( 0, 2 ), 16 );
          g = Number.parseInt( currentColor.slice( 2, 4 ), 16 );
          b = Number.parseInt( currentColor.slice( 4, 6 ), 16 );
        }
        else {
          r = currentColor[0];
          g = currentColor[1];
          b = currentColor[2];
        }
        this._generatedPalette[i] = (
          ( 255 << 24 ) // a
          | ( b << 16 ) // b
          | ( g << 8 ) // g
          | r // r
        );
      }
    }
    else {
      for ( let i = 0; i < this._palette.length; i += 1 ) {
        currentColor = this._palette[i];
        let r = 0;
        let g = 0;
        let b = 0;
        if ( typeof currentColor === 'string' ) {
          r = Number.parseInt( currentColor.slice( 0, 2 ), 16 );
          g = Number.parseInt( currentColor.slice( 2, 4 ), 16 );
          b = Number.parseInt( currentColor.slice( 4, 6 ), 16 );
        }
        else {
          r = currentColor[0];
          g = currentColor[1];
          b = currentColor[2];
        }
        this._generatedPalette[i] = (
          ( r << 24 ) // r
          | ( g << 16 ) // g
          | ( b << 8 ) // b
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
    if ( !paletteId ) {
      return;
    }
    // eslint-disable-next-line no-param-reassign
    x = Math.floor( x );
    // eslint-disable-next-line no-param-reassign
    y = Math.floor( y );
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
    if ( !paletteId ) {
      return;
    }
    this._screenData[y * this.width + x] = paletteId;
  }

  /**
   * Get the pallete index at a given position on the screen
   * @param {*} x - x position
   * @param {*} y - y position
   */
  getPixel( x, y ) {
    // eslint-disable-next-line no-param-reassign
    x = Math.floor( x );
    // eslint-disable-next-line no-param-reassign
    y = Math.floor( y );
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
   * @param {*} paletteId - palette index to be drawn
   */
  drawLine( x1, y1, x2, y2, paletteId ) {
    // eslint-disable-next-line no-param-reassign
    x1 = Math.floor( x1 );
    // eslint-disable-next-line no-param-reassign
    y1 = Math.floor( y1 );
    // eslint-disable-next-line no-param-reassign
    x2 = Math.floor( x2 );
    // eslint-disable-next-line no-param-reassign
    y2 = Math.floor( y2 );

    if ( x1 === x2 && y1 === y2 ) {
      // same coordinate, draw a pixel
      this.setPixel( x1, x2, paletteId );
      return;
    }

    if ( x1 === x2 ) {
      // vertical line
      if ( x1 < 0 || x1 >= this.width ) {
        return;
      }

      let firstY = y1 < y2 ? y1 : y2;
      let secondY = y1 < y2 ? y2 : y1;
      if ( secondY < 0 ) {
        return;
      }
      if ( firstY >= this.height ) {
        return;
      }

      if ( firstY < 0 ) {
        firstY = 0;
      }
      if ( secondY >= this.height ) {
        secondY = this.height - 1;
      }
      for ( let currentY = firstY; currentY <= secondY; currentY += 1 ) {
        this.setPixelUnsafe( x1, currentY, paletteId );
      }

      return;
    }

    if ( y1 === y2 ) {
      // horizontal line
      if ( y1 < 0 || y1 >= this.height ) {
        return;
      }

      let firstX = x1 < x2 ? x1 : x2;
      let secondX = x1 < x2 ? x2 : x1;
      if ( secondX < 0 ) {
        return;
      }
      if ( firstX >= this.width ) {
        return;
      }

      if ( firstX < 0 ) {
        firstX = 0;
      }
      if ( secondX >= this.width ) {
        secondX = this.width - 1;
      }
      for ( let currentX = firstX; currentX <= secondX; currentX += 1 ) {
        this.setPixelUnsafe( currentX, y1, paletteId );
      }

      return;
    }

    if ( Math.abs( y2 - y1 ) < Math.abs( x2 - x1 ) ) {
      // slope is less than 1
      if ( x1 > x2 ) {
        this._drawLineLow( x2, y2, x1, y1, paletteId );
      }
      else {
        this._drawLineLow( x1, y1, x2, y2, paletteId );
      }
    }
    else {
      // slope is greater than 1
      if ( y1 > y2 ) {
        this._drawLineHigh( x2, y2, x1, y1, paletteId );
      }
      else {
        this._drawLineHigh( x1, y1, x2, y2, paletteId );
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
   * Draw a filled rectangle
   *
   * @param {*} x - bottom left x position
   * @param {*} y - bottom left y position
   * @param {*} width - width of the rectangle
   * @param {*} height - height of the rectangle
   * @param {*} paletteId - the palette color to draw
   */
  drawRect( x, y, width, height, paletteId ) {
    // eslint-disable-next-line no-param-reassign
    x = Math.floor( x );
    // eslint-disable-next-line no-param-reassign
    y = Math.floor( y );
    // eslint-disable-next-line no-param-reassign
    width = Math.floor( width );
    // eslint-disable-next-line no-param-reassign
    height = Math.floor( height );

    if ( x >= this.width ) {
      return;
    }

    if ( y >= this.height ) {
      return;
    }

    let x1 = x;
    let y1 = y;
    let x2 = x + width - 1;
    let y2 = y + height - 1;

    if ( x2 < 0 ) {
      return;
    }
    if ( y2 < 0 ) {
      return;
    }

    if ( x1 < 0 ) {
      x1 = 0;
    }
    if ( y1 < 0 ) {
      y1 = 0;
    }

    if ( x2 >= this.width ) {
      x2 = this.width - 1;
    }

    if ( y2 >= this.height ) {
      y2 = this.height - 1;
    }

    for ( let currentY = y1; currentY <= y2; currentY += 1 ) {
      for ( let currentX = x1; currentX <= x2; currentX += 1 ) {
        this.setPixelUnsafe( currentX, currentY, paletteId );
      }
    }
  }

  /**
   * Draw a rectangle border
   *
   * @param {*} x - bottom left x position
   * @param {*} y - bottom left y position
   * @param {*} width - width of the rectangle
   * @param {*} height - height of the rectangle
   * @param {*} paletteId - the palette color to draw
   */
  drawRectBorder( x, y, width, height, paletteId ) {
    // eslint-disable-next-line no-param-reassign
    x = Math.floor( x );
    // eslint-disable-next-line no-param-reassign
    y = Math.floor( y );
    // eslint-disable-next-line no-param-reassign
    width = Math.floor( width );
    // eslint-disable-next-line no-param-reassign
    height = Math.floor( height );

    if ( x >= this.width ) {
      return;
    }

    if ( y >= this.height ) {
      return;
    }

    if ( width === 1 && height === 1 ) {
      this.setPixel( x, y, paletteId );
      return;
    }

    const x2 = x + width - 1;
    const y2 = y + height - 1;

    if ( x2 < 0 ) {
      return;
    }
    if ( y2 < 0 ) {
      return;
    }

    if ( width === 1 ) {
      this.drawLine( x, y, x, y2, paletteId );
      return;
    }

    if ( height === 1 ) {
      this.drawLine( x, y, x2, y, paletteId );
      return;
    }

    this.drawLine( x, y, x, y2, paletteId ); // left
    this.drawLine( x, y2, x2, y2, paletteId ); // top
    this.drawLine( x2, y2, x2, y, paletteId ); // right
    this.drawLine( x2, y, x, y, paletteId ); // bottom
  }

  /**
   * Draw a filled circle
   *
   * @param {number} centerX - the x coordinate of the center of the circle
   * @param {numbe} centerY -  the y coordinate of the center of the circle
   * @param {number} radius - the radius of the circle
   * @param {number} paletteId - the palette color to draw
   */
  drawCircle( centerX, centerY, radius, paletteId ) {
    if ( radius <= 0 ) {
      return;
    }

    // eslint-disable-next-line no-param-reassign
    centerX = Math.floor( centerX );
    // eslint-disable-next-line no-param-reassign
    centerY = Math.floor( centerY );
    // eslint-disable-next-line no-param-reassign
    radius = Math.floor( radius );

    if ( radius === 1 ) {
      this.drawCircleBorder( centerX, centerY, radius, paletteId );
      this.setPixel( centerX, centerY, paletteId );
      return;
    }

    let x = 0;
    let y = radius;
    this.drawLine( centerX - radius, centerY, centerX + radius, centerY, paletteId );

    let decision = 3 - 2 * radius;

    while ( y >= x ) {
      x += 1;

      if ( decision > 0 ) {
        y -= 1;
        decision = decision + 4 * ( x - y ) + 10;
      }
      else {
        decision = decision + 4 * x + 6;
      }

      this._drawCircleFilledOctants( centerX, centerY, x, y, paletteId );
    }
  }

  /**
   * Draw a circle border
   *
   * @param {number} centerX - the x coordinate of the center of the circle
   * @param {numbe} centerY -  the y coordinate of the center of the circle
   * @param {number} radius - the radius of the circle
   * @param {number} paletteId - the palette color to draw
   */
  drawCircleBorder( centerX, centerY, radius, paletteId ) {
    if ( radius <= 0 ) {
      return;
    }

    // eslint-disable-next-line no-param-reassign
    centerX = Math.floor( centerX );
    // eslint-disable-next-line no-param-reassign
    centerY = Math.floor( centerY );
    // eslint-disable-next-line no-param-reassign
    radius = Math.floor( radius );

    let x = 0;
    let y = radius;
    this._drawCircleBorderOctants( centerX, centerY, x, y, paletteId );

    let decision = 3 - 2 * radius;

    while ( y >= x ) {
      x += 1;

      if ( decision > 0 ) {
        y -= 1;
        decision = decision + 4 * ( x - y ) + 10;
      }
      else {
        decision = decision + 4 * x + 6;
      }

      this._drawCircleBorderOctants( centerX, centerY, x, y, paletteId );
    }
  }

  /**
   * helper method for drawing filled circles
   */
  _drawCircleFilledOctants( centerX, centerY, x, y, paletteId ) {
    this.drawLine( centerX - x, centerY + y, centerX + x, centerY + y, paletteId );
    this.drawLine( centerX - x, centerY - y, centerX + x, centerY - y, paletteId );
    this.drawLine( centerX - y, centerY + x, centerX + y, centerY + x, paletteId );
    this.drawLine( centerX - y, centerY - x, centerX + y, centerY - x, paletteId );
  }

  /**
   * helper method for drawing circle borders
   */
  _drawCircleBorderOctants( centerX, centerY, x, y, paletteId ) {
    this.setPixel( centerX + x, centerY + y, paletteId );
    this.setPixel( centerX - x, centerY + y, paletteId );
    this.setPixel( centerX + x, centerY - y, paletteId );
    this.setPixel( centerX - x, centerY - y, paletteId );
    this.setPixel( centerX + y, centerY + x, paletteId );
    this.setPixel( centerX - y, centerY + x, paletteId );
    this.setPixel( centerX + y, centerY - x, paletteId );
    this.setPixel( centerX - y, centerY - x, paletteId );
  }

  /**
   * Draw a tile
   * @param {number} gid - the gid of the tile
   * @param {number} x - the x position on the screen
   * @param {number} y - the y position on the screen
   * @param {number} flip - should we flip the tile? 0: no, 1: x, 2: y, 3: xy
   * @param {number} rotate - The number of degrees to rotate. Only 90 degree increments are supported.
   */
  drawTile( gid, x, y, flip = 0, rotate = 0 ) {
    if ( !gid ) {
      return;
    }

    // eslint-disable-next-line no-param-reassign
    x = Math.floor( x );
    // eslint-disable-next-line no-param-reassign
    y = Math.floor( y );

    if ( x >= this.width ) {
      return;
    }

    if ( y >= this.height ) {
      return;
    }

    const { tileSize } = this.tileData;

    if ( x + tileSize < 0 ) {
      return;
    }

    if ( y + tileSize < 0 ) {
      return;
    }

    const flipX = flip === 1 || flip === 3;
    const flipY = flip === 2 || flip === 3;

    let xIndex = 0;
    let yIndex = 0;

    // only rotate in 90 degree increments
    let rotValue = 0;
    if ( rotate === 90 || rotate === -270 ) {
      rotValue = 1;
    }
    else if ( rotate === 180 || rotate === -180 ) {
      rotValue = 2;
    }
    else if ( rotate === 270 || rotate === -90 ) {
      rotValue = 3;
    }

    const basePosition = ( gid - 1 ) * tileSize * tileSize;
    for ( let tileY = 0; tileY < tileSize; tileY += 1 ) {
      for ( let tileX = 0; tileX < tileSize; tileX += 1 ) {
        if ( flipX ) {
          xIndex = tileSize - tileX - 1;
        }
        else {
          xIndex = tileX;
        }

        if ( flipY ) {
          yIndex = tileSize - tileY - 1;
        }
        else {
          yIndex = tileY;
        }

        const paletteId = this.tileData.data[basePosition + yIndex * tileSize + xIndex];

        if ( rotValue === 3 ) {
          // 270
          this.setPixel( x + tileSize - tileY - 1, y + tileX, paletteId );
        }
        else if ( rotValue === 2 ) {
          // 180
          this.setPixel( x + tileSize - tileX - 1, y + tileSize - tileY - 1, paletteId );
        }
        else if ( rotValue === 1 ) {
          // 90
          this.setPixel( x + tileY, y + tileSize - tileX - 1, paletteId );
        }
        else {
          this.setPixel( x + tileX, y + tileY, paletteId );
        }
      }
    }
  }

  /**
   * Draw a section of a tile map
   * @param {number} gid - the gid of bottom left tile in the section
   * @param {number} width - the width in tiles of the section
   * @param {number} height - the height in tiles of the section
   * @param {number} screenX - the x position on the screen
   * @param {number} screenY - the y position on the screen
   * @param {number} flip - should we flip the tiles? 0: no, 1: x, 2: y, 3: xy
   * @param {number} rotate - The number of degrees to rotate. Only 90 degree increments are supported.
   */
  drawTileSection( gid, width, height, screenX, screenY, flip = 0, rotate = 0 ) {
    const tileSectionData = this.tileData.getTileSectionData( gid, width, height );
    if ( tileSectionData ) {
      this.drawArray(
        tileSectionData.data,
        tileSectionData.width,
        tileSectionData.height,
        screenX,
        screenY,
        flip,
        rotate,
      );
    }
  }

  /**
   * Draw an array
   * @param {array} arrayData - array of palette data
   * @param {number} arrayWidth - the width of the array data
   * @param {number} arrayHeight - the height of the array data
   * @param {number} screenX - the x position on the screen
   * @param {number} screenY - the y position on the screen
   * @param {number} flip - should we flip the tiles? 0: no, 1: x, 2: y, 3: xy
   * @param {number} rotate - The number of degrees to rotate. Only 90 degree increments are supported.
   */
  drawArray( arrayData, arrayWidth, arrayHeight, screenX, screenY, flip = 0, rotate = 0 ) {
    const flipX = flip === 1 || flip === 3;
    const flipY = flip === 2 || flip === 3;

    let rotValue = 0;
    if ( rotate === 90 || rotate === -270 ) {
      rotValue = 1;
    }
    else if ( rotate === 180 || rotate === -180 ) {
      rotValue = 2;
    }
    else if ( rotate === 270 || rotate === -90 ) {
      rotValue = 3;
    }

    let xIndex = 0;
    let yIndex = 0;

    for ( let y = 0; y < arrayHeight; y += 1 ) {
      for ( let x = 0; x < arrayWidth; x += 1 ) {
        if ( flipX ) {
          xIndex = arrayWidth - x - 1;
        }
        else {
          xIndex = x;
        }

        if ( flipY ) {
          yIndex = arrayHeight - y - 1;
        }
        else {
          yIndex = y;
        }

        const paletteId = arrayData[yIndex * arrayWidth + xIndex];

        if ( rotValue === 3 ) {
          // 270
          this.setPixel( screenX + arrayHeight - y - 1, screenY + x, paletteId );
        }
        else if ( rotValue === 2 ) {
          // 180
          this.setPixel( screenX + arrayWidth - x - 1, screenY + arrayHeight - y - 1, paletteId );
        }
        else if ( rotValue === 1 ) {
          // 90
          this.setPixel( screenX + y, screenY + arrayWidth - x - 1, paletteId );
        }
        else {
          this.setPixel( screenX + x, screenY + y, paletteId );
        }
      }
    }
  }

  /**
   * Draw a TileMap layer to the screen
   * @param {number} x - origin x position on the TileMap
   * @param {number} y - origin y position on the TileMap
   * @param {number} width - how many tiles wide to draw, -1 is the width of the Tile Map
   * @param {number} height - how many tiles high to draw, -1 is the height of the Tile Map
   * @param {number} screenX - origin x position on the screen
   * @param {number} screenY - origin y position on the screen
   * @param {number} map - the index of the tilemap to draw
   * @param {number} layer - the index of the layer to draw
   */
  drawMap( x, y, width = -1, height = -1, screenX = 0, screenY = 0, map = 0, layer = 0 ) {
    // eslint-disable-next-line no-param-reassign
    screenX = Math.floor( screenX );
    // eslint-disable-next-line no-param-reassign
    screenY = Math.floor( screenY );

    const tileMap = this.mapData.tileMaps[map];
    const layerData = tileMap.layers[layer];
    const { tileSize } = this.tileData;
    let maxX = x + width - 1;
    let maxY = y + height - 1;

    if ( maxX >= tileMap.width || width < 0 ) {
      maxX = tileMap.width - 1;
    }
    if ( maxY >= tileMap.height || height < 0 ) {
      maxY = tileMap.height - 1;
    }

    const offsetX = x * tileSize;
    const offsetY = y * tileSize;

    for ( let currentY = y; currentY <= maxY; currentY += 1 ) {
      for ( let currentX = x; currentX <= maxX; currentX += 1 ) {
        const gid = layerData[currentY * tileMap.width + currentX];
        if ( gid ) {
          this.drawTile(
            gid,
            screenX + currentX * tileSize - offsetX,
            screenY + currentY * tileSize - offsetY,
          );
        }
      }
    }
  }

  /**
   * Draw a line of text to the screen.
   * Newlines are not supported, this will draw just a single line
   * @param {string} text - the text to draw
   * @param {number} x - the x position on the screen to draw to
   * @param {number} y - the y position on the screen to draw to
   * @param {number} paletteId - the palette if for the main color
   * @param {number} outlinePaletteId - the palette id for the outline color
   * @param {number} font - the index of the font to use
   */
  drawText( text, x, y, paletteId, outlinePaletteId = 0, font = 0 ) {
    // eslint-disable-next-line no-param-reassign
    x = Math.floor( x );
    // eslint-disable-next-line no-param-reassign
    y = Math.floor( y );

    const currentFont = this.fontData.fonts[font];
    let currentX = x;
    for ( let i = 0; i < text.length; i += 1 ) {
      const charCode = text.charCodeAt( i );
      this.drawChar( charCode, currentX, y, paletteId, outlinePaletteId, font );
      currentX += currentFont.widthForChar( charCode );
      currentX += currentFont.letterSpacing;
    }
  }

  /**
   * Draw an individual character to the screen
   * @param {number} charCode - the unicode point to draw
   * @param {number} x - the x position on the screen to draw to
   * @param {number} y - the y position on the screen to draw to
   * @param {number} paletteId - the palette id for the main color
   * @param {number} outlinePaletteId - the palette id for the outline color
   * @param {number} font - the index of the font to use
   */
  drawChar( charCode, x, y, paletteId, outlinePaletteId = 0, font = 0 ) {
    // eslint-disable-next-line no-param-reassign
    x = Math.floor( x );
    // eslint-disable-next-line no-param-reassign
    y = Math.floor( y );

    const currentFont = this.fontData.fonts[font];
    const { tileSize, originX, originY } = currentFont;
    const basePosition = currentFont.baseIndexForChar( charCode );
    for ( let fontY = 0; fontY < tileSize; fontY += 1 ) {
      for ( let fontX = 0; fontX < tileSize; fontX += 1 ) {
        const id = currentFont.data[basePosition + fontY * tileSize + fontX];
        if ( id === 1 ) {
          this.setPixel( x + fontX - originX, y + fontY - originY, paletteId );
        }
        else if ( id === 2 ) {
          this.setPixel( x + fontX - originX, y + fontY - originY, outlinePaletteId );
        }
      }
    }
  }

  /**
   * draw the data from {@link _screenData} to the canvas
   */
  drawScreen() {
    if ( this.dataOnlyMode ) {
      return;
    }

    const buffer = new ArrayBuffer( this._imageData.data.length );
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
    this._imageData.data.set( data8 );
    this._context.putImageData( this._imageData, 0, 0 );
  }
}

Screen.SCALE_CONSTANT = 1;
Screen.SCALE_FIT_WINDOW = 2;

export default Screen;
