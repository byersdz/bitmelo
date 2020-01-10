
import LZString from '../lz-string/libs/lz-string';

class ConvertData {
  static arrayToRun( array ) {
    const result = [];
    let currentValue = array[0];
    let runNumber = 0;

    for ( let i = 0; i < array.length; i += 1 ) {
      if ( array[i] === currentValue ) {
        runNumber += 1;
      }
      else {
        result.push( runNumber );
        result.push( currentValue );
        runNumber = 1;
        currentValue = array[i];
      }
    }
    // add the last item
    result.push( runNumber );
    result.push( currentValue );
    return result;
  }

  static runToArray( runArray ) {
    const result = [];
    let runPosition = 0;
    while ( runPosition < runArray.length ) {
      const runLength = runArray[runPosition];
      const item = runArray[runPosition + 1];
      for ( let j = 0; j < runLength; j += 1 ) {
        result.push( item );
      }
      runPosition += 2;
    }

    return result;
  }

  static arrayToCompressedString( array ) {
    const arrayString = array.join( ',' );
    const compressed = LZString.compressToEncodedURIComponent( arrayString );
    return compressed;
  }

  static compressedStringToArray( compressedString ) {
    const decompressedString = LZString.decompressFromEncodedURIComponent( compressedString );
    const stringArray = decompressedString.split( ',' );
    const result = [];
    for ( let i = 0; i < stringArray.length; i += 1 ) {
      result.push( Number.parseInt( stringArray[i], 10 ) );
    }
    return result;
  }
}

export default ConvertData;
