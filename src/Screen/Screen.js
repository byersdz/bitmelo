
export const SCALE_CONSTANT = 1;
export const SCALE_FIT_WINDOW = 2;

/**
 * Represents a game screen for low resolution games.
 * Has simple drawing functions using an indexed palette of a maximum of 256 colors
 * The origin (0, 0) position of the screen is on the bottom left
 */
class Screen {
  constructor() {
    this.conainerId = 'minnow-container';
    this.container = null;
    this.width = 320;
    this.height = 180;
    this.scale = 3;
    this.maxScale = -1;
    this.minScale = 1;
    this.scaleMode = SCALE_CONSTANT;
    this.horizontalScaleCushion = 0;
    this.verticalScaleCushion = 0;
    this.rescaleOnWindowResize = true;
    this.hideCursor = false;
    this.tileData = null;
    this.mapData = null;

    this.onScaleChange = null;

    this.canvas = null;
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
    this.container = document.getElementById( this.conainerId );

    this.canvas = document.createElement( 'canvas' );
    this.canvas.setAttribute( 'id', 'game-device' );
    this.canvas.setAttribute( 'width', this.width );
    this.canvas.setAttribute( 'height', this.height );

    this._setScale();

    if ( this.rescaleOnWindowResize && this.scaleMode !== SCALE_CONSTANT ) {
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

  _setScale() {
    if ( this.scaleMode === SCALE_FIT_WINDOW ) {
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

  _setCanvasStyle() {
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
   *  [0, 0, 0], // black, the 0 index is transparent
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
    if ( !paletteId ) {
      return;
    }
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

  drawTile( gid, x, y ) {
    const { tileSize } = this.tileData;
    const basePosition = ( gid - 1 ) * tileSize * tileSize;
    for ( let tileY = 0; tileY < tileSize; tileY += 1 ) {
      for ( let tileX = 0; tileX < tileSize; tileX += 1 ) {
        const paletteId = this.tileData.data[basePosition + tileY * tileSize + tileX];
        this.setPixel( x + tileX, y + tileY, paletteId );
      }
    }
  }

  drawMap( x, y, width, height, screenX, screenY, map = 0, layer = 0 ) {
    const tileMap = this.mapData.tileMaps[map];
    const layerData = tileMap.layers[layer];
    const { tileSize } = this.tileData;
    for ( let currentY = y; currentY <= y + height; currentY += 1 ) {
      for ( let currentX = x; currentX <= x + width; currentX += 1 ) {
        const gid = layerData[currentY * tileMap.width + currentX];
        if ( gid ) {
          this.drawTile( gid, screenX + currentX * tileSize, screenY + currentY * tileSize );
        }
      }
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
