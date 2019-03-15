
import Font from './Font';

/**
 * Holds all of the font data
 */
class FontData {
  constructor() {
    this.fonts = [];
  }

  addFont( fontData ) {
    this.fonts.push( new Font( fontData ) );
  }
}

export default FontData;
