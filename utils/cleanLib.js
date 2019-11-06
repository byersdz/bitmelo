
const fs = require( 'fs' );
const path = require( 'path' );

const libDirectory = 'lib';

fs.readdir( libDirectory, ( err, files ) => {
  if ( err ) {
    console.log( err );
    return;
  }

  files.forEach( ( file ) => {
    const filePath = path.join( libDirectory, file );
    fs.unlink( filePath, ( unlinkErr ) => {
      if ( unlinkErr ) {
        console.log( unlinkErr );
      }
    } );
  } );
} );
