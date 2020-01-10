
// renaming is required because webpack wont minify a txt lib
const fs = require( 'fs' );

const oldName = 'lib/bitmelo.min.txt.js';
const newName = 'lib/bitmelo.min.txt';

fs.rename( oldName, newName, ( err ) => {
  if ( err ) {
    console.log( err );
  }
} );
