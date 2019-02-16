import * as Keys from './Keys';

class Input {
  constructor() {
    this._keysRaw = new Uint8ClampedArray( 256 );
    this._currentKeys = new Uint8ClampedArray( 256 );
    this._lastKeys = new Uint8ClampedArray( 256 );

    this._buttonsToKeys = new Uint8ClampedArray( 32 );

    // default button mappings
    this._buttonsToKeys[Keys.GAME_LEFT] = Keys.LEFT_ARROW;
    this._buttonsToKeys[Keys.GAME_RIGHT] = Keys.RIGHT_ARROW;
    this._buttonsToKeys[Keys.GAME_UP] = Keys.UP_ARROW;
    this._buttonsToKeys[Keys.GAME_DOWN] = Keys.DOWN_ARROW;

    this._buttonsToKeys[Keys.GAME_ACTION_ONE] = Keys.Z_KEY;
    this._buttonsToKeys[Keys.GAME_ACTION_TWO] = Keys.X_KEY;
    this._buttonsToKeys[Keys.GAME_ACTION_THREE] = Keys.A_KEY;
    this._buttonsToKeys[Keys.GAME_ACTION_FOUR] = Keys.S_KEY;
    this._buttonsToKeys[Keys.GAME_LEFT_TRIGGER] = Keys.Q_KEY;
    this._buttonsToKeys[Keys.GAME_RIGHT_TRIGGER] = Keys.W_KEY;

    this._buttonsToKeys[Keys.GAME_PAUSE] = Keys.P_KEY;

    this._buttonsToKeys[Keys.MENU_LEFT] = Keys.LEFT_ARROW;
    this._buttonsToKeys[Keys.MENU_RIGHT] = Keys.RIGHT_ARROW;
    this._buttonsToKeys[Keys.MENU_UP] = Keys.UP_ARROW;
    this._buttonsToKeys[Keys.MENU_DOWN] = Keys.DOWN_ARROW;

    this._buttonsToKeys[Keys.MENU_CONFIRM] = Keys.X_KEY;
    this._buttonsToKeys[Keys.MENU_BACK] = Keys.Z_KEY;

    this._currentButtons = new Uint8ClampedArray( 32 );
    this._lastButtons = new Uint8ClampedArray( 32 );

    window.addEventListener( 'keydown', this.keyDown.bind( this ), false );
    window.addEventListener( 'keyup', this.keyUp.bind( this ), false );
  }

  keyDown( e ) {
    this._keysRaw[e.keyCode] = 1;
  }

  keyUp( e ) {
    this._keysRaw[e.keyCode] = 0;
  }

  pollInput() {
    for ( let i = 0; i < 256; i += 1 ) {
      this._lastKeys[i] = this._currentKeys[i];
      this._currentKeys[i] = this._keysRaw[i];
    }

    this._updateButtons();
  }

  getKeyPressed( keyCode ) {
    if ( keyCode < 0 || keyCode >= 256 ) {
      return false;
    }

    return this._currentKeys[keyCode] > 0;
  }

  getKeyDown( keyCode ) {
    if ( keyCode < 0 || keyCode >= 256 ) {
      return false;
    }

    const current = this._currentKeys[keyCode] > 0;
    const last = this._lastKeys[keyCode] > 0;
    return current && !last;
  }

  getKeyUp( keyCode ) {
    if ( keyCode < 0 || keyCode >= 256 ) {
      return false;
    }

    const current = this._currentKeys[keyCode] > 0;
    const last = this._lastKeys[keyCode] > 0;
    return !current && last;
  }

  _updateButtons() {
    this._updateButton( 'left', Keys.GAME_LEFT );
    this._updateButton( 'right', Keys.GAME_RIGHT );
    this._updateButton( 'up', Keys.GAME_UP );
    this._updateButton( 'down', Keys.GAME_DOWN );

    this._updateButton( 'action1', Keys.GAME_ACTION_ONE );
    this._updateButton( 'action2', Keys.GAME_ACTION_TWO );
    this._updateButton( 'action3', Keys.GAME_ACTION_THREE );
    this._updateButton( 'action4', Keys.GAME_ACTION_FOUR );
    this._updateButton( 'leftTrigger', Keys.GAME_LEFT_TRIGGER );
    this._updateButton( 'rightTrigger', Keys.GAME_RIGHT_TRIGGER );

    this._updateButton( 'pause', Keys.GAME_PAUSE );

    this._updateButton( 'menuLeft', Keys.MENU_LEFT );
    this._updateButton( 'menuRight', Keys.MENU_RIGHT );
    this._updateButton( 'menuUp', Keys.MENU_UP );
    this._updateButton( 'menuDown', Keys.MENU_DOWN );

    this._updateButton( 'menuConfirm', Keys.MENU_CONFIRM );
    this._updateButton( 'menuBack', Keys.MENU_BACK );
  }

  _updateButton( name, index ) {
    const key = this._buttonsToKeys[index];
    const pressed = this.getKeyPressed( key );
    const down = this.getKeyDown( key );
    const up = this.getKeyUp( key );

    this[name] = { pressed, down, up };
  }
}

export default Input;
