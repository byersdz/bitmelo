import Screen from './Screen';

class Engine {
  constructor() {
    this.screen = null;
  }

  create() {
    this.screen = new Screen();
    this.screen.create();
  }
}

export default Engine;
