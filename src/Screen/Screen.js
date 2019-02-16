
/**
 * The screen class
 */
class Screen {
  constructor() {
    this.width = 320;
    this.height = 180;
    this.scale = 3;
    this.palette = [
      [0x00, 0x00, 0x00],
      [0xff, 0xff, 0xff],
      [0xff, 0x00, 0x00],
      [0x00, 0xff, 0x00],
      [0x00, 0x00, 0xff],
    ];

    this.canvas = null;
    this.context = null;
    this._screenData = null;
    this._generatedPalette = null;

    this._isLittleEndian = true;
  }

  create() {
    const container = document.createElement( 'div' );
    container.id = 'main-container';

    this.canvas = document.createElement( 'canvas' );
    this.canvas.setAttribute( 'id', 'game-device' );
    this.canvas.setAttribute( 'width', this.width );
    this.canvas.setAttribute( 'height', this.height );

    let canvasStyle = `width: ${ this.width * this.scale }px;`;
    canvasStyle += `height: ${ this.height * this.scale }px;`;
    canvasStyle += 'image-rendering: -webkit-optimize-contrast;';
    canvasStyle += 'image-rendering: crisp-edges;';
    canvasStyle += 'image-rendering: pixelated;';

    this.canvas.setAttribute( 'style', canvasStyle );

    container.appendChild( this.canvas );
    document.body.appendChild( container );

    this.context = this.canvas.getContext( '2d' );

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


    this._buildPalette();
  }

  _buildPalette() {
    this._generatedPalette = new Uint32Array( this.palette.length + 1 );
    let currentColor = null;
    this._generatedPalette[0] = 0x00000000;
    if ( this._isLittleEndian ) {
      for ( let i = 0; i < this.palette.length; i += 1 ) {
        currentColor = this.palette[i];
        this._generatedPalette[i + 1] = (
          ( 255 << 24 ) // a
          | ( currentColor[2] << 16 ) // b
          | ( currentColor[1] << 8 ) // g
          | currentColor[0] // r
        );
      }
    }
    else {
      for ( let i = 0; i < this.palette.length; i += 1 ) {
        currentColor = this.palette[i];
        this._generatedPalette[i + 1] = (
          ( currentColor[0] << 24 ) // r
          | ( currentColor[1] << 16 ) // g
          | ( currentColor[2] << 8 ) // b
          | 255 // a
        );
      }
    }
  }

  setPixel( x, y, id ) {
    if ( x < 0 || x >= this.width || y < 0 || y >= this.height ) {
      return;
    }
    this._screenData[y * this.width + x] = id;
  }

  setPixelUnsafe( x, y, id ) {
    this._screenData[y * this.width + x] = id;
  }

  getPixel( x, y ) {
    return this._screenData[y * this.width + x];
  }

  clearScreen( id ) {
    this._screenData.fill( id );
  }

  _drawScreen() {
    const imageData = this.context.getImageData( 0, 0, this.width, this.height );
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
    this.context.putImageData( imageData, 0, 0 );
  }
}

export default Screen;
