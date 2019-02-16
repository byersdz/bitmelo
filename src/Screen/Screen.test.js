
function sum( a, b ) {
  return a + b;
}

test( 'Adding 1 + 1 equals 2', () => {
  expect( sum( 1, 1 ) ).toBe( 2 );
} );
