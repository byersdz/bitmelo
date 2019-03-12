
import Font from './Font';

class FontData {
  constructor() {
    this.fonts = [];
  }

  addFont( fontData ) {
    this.fonts.push( new Font( fontData ) );
  }
}

export default FontData;
