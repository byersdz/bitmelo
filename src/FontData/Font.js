
class Font {
  constructor( fontData ) {
    this.standardWidth = 5;
    this.letterSpacing = 1;

    this.tileSize = 16;
    this.width = 16;
    this.height = 16;
    this.originX = 1;
    this.originY = 3;

    this.charData = null;
    this.data = null;

    if ( fontData ) {
      this.standardWidth = fontData.standardWidth;
      this.letterSpacing = fontData.letterSpacing;

      this.tileSize = fontData.tileSize;
      this.width = fontData.width;
      this.height = fontData.height;
      this.originX = fontData.originX;
      this.originY = fontData.originY;
      this.charData = fontData.charData;

      this.data = new Uint8ClampedArray( this.width * this.height * this.tileSize * this.tileSize );
      const { data } = fontData;
      let runPosition = 0;
      let dataPosition = 0;
      while ( runPosition < data.length ) {
        const runLength = data[runPosition];
        const paletteId = parseInt( data[runPosition + 1], 10 );
        for ( let j = 0; j < runLength; j += 1 ) {
          this.data[dataPosition] = paletteId;
          dataPosition += 1;
        }
        runPosition += 2;
      }
    }
  }

  widthForChar( charCode ) {
    const charKey = charCode.toString();
    if ( this.charData && this.charData[charKey] ) {
      if ( this.charData[charKey].width !== undefined ) {
        return this.charData[charKey].width;
      }
    }
    return this.standardWidth;
  }
}

export default Font;
