
import Font from './Font';

/**
 * Holds all of the font data
 */
class FontData {
  constructor() {
    /**
     * Array of Font objects
     */
    this.fonts = [];
  }

  /**
   * Add a Font to this.fonts from font data
   * @param {*} fontData
   */
  addFont( fontData ) {
    this.fonts.push( new Font( fontData ) );
  }
}

export default FontData;
