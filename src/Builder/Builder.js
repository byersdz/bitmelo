// esprima requires a require for some reason
const esprima = require( 'esprima' );

class Builder {
  /**
   * Instrument a script string to add calls that can break out of loops.
   * The instrumented code will assume that there is a global bitmelo.Engine variable
   * named 'engine'.
   * @param {string} script
   */
  static instrumentScript( script ) {
    try {
      const patches = [];

      esprima.parseScript(
        script,
        {
          range: true,
          tolerant: false,
        },
        ( node ) => {
          switch ( node.type ) {
            case 'DoWhileStatement':
            case 'ForStatement':
            case 'ForInStatement':
            case 'ForOfStatement':
            case 'WhileStatement': {
              let start = 1 + node.body.range[0];
              const end = node.body.range[1];

              let startCode = 'if (engine.shouldBreak()) { break; }';
              let endCode = '';

              if ( node.body.type !== 'BlockStatement' ) {
                startCode = `{${ startCode }`;
                endCode = '}';
                start -= 1;
              }

              patches.push( { position: start, code: startCode } );
              patches.push( { position: end, code: endCode } );
              break;
            }
            default: break;
          }
        },
      );

      let result = script;

      patches.sort( ( a, b ) => {
        return b.position - a.position;
      } ).forEach( ( patch ) => {
        result = result.slice( 0, patch.position ) + patch.code + result.slice( patch.position );
      } );

      return result;
    }
    catch ( err ) {
      console.error( err );
      return script;
    }
  }
}

export default Builder;
