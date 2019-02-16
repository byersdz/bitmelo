import Screen from '../Screen/Screen';
import Input from '../Input/Input';

class Engine {
  constructor() {
    this.onInit = null;
    this.onUpdate = null;
    this.screen = new Screen();
    this.input = new Input();

    this._update = this._update.bind( this );
  }

  begin() {
    if ( this.onInit ) {
      this.onInit();
    }

    this.screen.init();
    requestAnimationFrame( this._update );
  }

  _update() {
    this.input.pollInput();

    if ( this.onUpdate ) {
      this.onUpdate();
    }

    this.screen.drawScreen();
    requestAnimationFrame( this._update );
  }
}

export default Engine;
