
const screen = new minnow.Screen();

screen.create();
screen.clearScreen( 1 );
screen.setPixel( 0, 0, 3 );
screen._drawScreen();
