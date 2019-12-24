
import ConvertData from './ConvertData';

test( 'array to run min', () => {
  expect( ConvertData.arrayToRun( [1, 2, 3] ) ).toEqual( [1, 1, 1, 2, 1, 3] );
} );

test( 'array to run large', () => {
  const source = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 6, 6, 6, 6, 2, 2];
  const target = [10, 5, 1, 2, 4, 6, 2, 2];
  expect( ConvertData.arrayToRun( source ) ).toEqual( target );
} );

test( 'array to run mono', () => {
  const size = 10000;
  const source = new Array( size );
  source.fill( 99 );
  const target = [size, 99];
  expect( ConvertData.arrayToRun( source ) ).toEqual( target );
} );

test( 'run to array min', () => {
  expect( ConvertData.runToArray( [1, 1, 1, 2, 1, 3] ) ).toEqual( [1, 2, 3] );
} );

test( 'run to array large', () => {
  const source = [10, 5, 1, 2, 4, 6, 2, 2];
  const target = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 6, 6, 6, 6, 2, 2];
  expect( ConvertData.runToArray( source ) ).toEqual( target );
} );

test( 'run to array mono', () => {
  const size = 10000;
  const source = [size, 99];
  const target = new Array( size );
  target.fill( 99 );
  expect( ConvertData.runToArray( source ) ).toEqual( target );
} );

test( 'array to compressed min', () => {
  const testArray = [4, 5, 6];
  const compressed = ConvertData.arrayToCompressedString( testArray );
  const decompressed = ConvertData.compressedStringToArray( compressed );

  expect( decompressed ).toEqual( testArray );
} );

test( 'array to match known compressed string', () => {
  const testArray = [255, 0, 1, 5, 6, 7, 99, 128, 22, 37];
  const compressed = ConvertData.arrayToCompressedString( testArray );
  expect( compressed ).toEqual( 'EwVhBoAZwRnCBs4Ds4CcbbABzmMcAZmSA' );
} );

test( 'compressed string to match known array', () => {
  const compressed = 'EwVhBoAZwRnCBs4Ds4CcbbABzmMcAZmSA';
  const decompressed = ConvertData.compressedStringToArray( compressed );

  expect( decompressed ).toEqual( [255, 0, 1, 5, 6, 7, 99, 128, 22, 37] );
} );
