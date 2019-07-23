import Keys from './Keys';

/**
 * Handle game input
 */
class Input {
  constructor() {
    this.canvas = null;
    this.canvasScale = 1;
    this.screenWidth = 1;
    this.screenHeight = 1;

    this.mouse = {};
    this.mouse.isOffScreen = true;
    this.mouse.position = {
      x: -1,
      y: -1,
    };

    this.mouse.left = {
      pressed: false,
      down: false,
      up: false,
    };

    this.mouse.right = {
      pressed: false,
      down: false,
      up: false,
    };

    this._keysRaw = new Uint8ClampedArray( 256 );
    this._currentKeys = new Uint8ClampedArray( 256 );
    this._lastKeys = new Uint8ClampedArray( 256 );

    this._buttonsToKeys = new Uint8ClampedArray( 32 );

    // default button mappings
    this._buttonsToKeys[Input.GAME_LEFT] = Keys.LEFT_ARROW;
    this._buttonsToKeys[Input.GAME_RIGHT] = Keys.RIGHT_ARROW;
    this._buttonsToKeys[Input.GAME_UP] = Keys.UP_ARROW;
    this._buttonsToKeys[Input.GAME_DOWN] = Keys.DOWN_ARROW;

    this._buttonsToKeys[Input.GAME_ACTION_ONE] = Keys.Z_KEY;
    this._buttonsToKeys[Input.GAME_ACTION_TWO] = Keys.X_KEY;
    this._buttonsToKeys[Input.GAME_ACTION_THREE] = Keys.A_KEY;
    this._buttonsToKeys[Input.GAME_ACTION_FOUR] = Keys.S_KEY;
    this._buttonsToKeys[Input.GAME_LEFT_TRIGGER] = Keys.Q_KEY;
    this._buttonsToKeys[Input.GAME_RIGHT_TRIGGER] = Keys.W_KEY;

    this._buttonsToKeys[Input.GAME_PAUSE] = Keys.P_KEY;

    this._buttonsToKeys[Input.MENU_LEFT] = Keys.LEFT_ARROW;
    this._buttonsToKeys[Input.MENU_RIGHT] = Keys.RIGHT_ARROW;
    this._buttonsToKeys[Input.MENU_UP] = Keys.UP_ARROW;
    this._buttonsToKeys[Input.MENU_DOWN] = Keys.DOWN_ARROW;

    this._buttonsToKeys[Input.MENU_CONFIRM] = Keys.X_KEY;
    this._buttonsToKeys[Input.MENU_BACK] = Keys.Z_KEY;

    this._currentButtons = new Uint8ClampedArray( 32 );
    this._lastButtons = new Uint8ClampedArray( 32 );

    this._currentMouseLeft = false;
    this._lastMouseLeft = false;
    this._forceMouseLeftDown = false;

    this._currentMouseRight = false;
    this._lastMouseRight = false;
    this._forceMouseRightDown = false;
  }

  /**
   * Do initial setup. Add event listeners.
   */
  init() {
    window.addEventListener( 'keydown', this._keyDown.bind( this ), false );
    window.addEventListener( 'keyup', this._keyUp.bind( this ), false );

    if ( this.canvas ) {
      this.canvas.oncontextmenu = ( e ) => {
        e.preventDefault();
      };

      this.canvas.addEventListener( 'pointerenter', this._pointerEnter.bind( this ), false );
      this.canvas.addEventListener( 'pointermove', this._pointerMove.bind( this ), false );
      this.canvas.addEventListener( 'pointerdown', this._pointerDown.bind( this ), false );
      this.canvas.addEventListener( 'pointerup', this._pointerUp.bind( this ), false );
      this.canvas.addEventListener( 'pointerleave', this._pointerLeave.bind( this ), false );
    }
  }

  _keyDown( e ) {
    if ( e.code ) {
      this._keysRaw[Keys.codesToKeyCodes[e.code]] = 1;
    }
    else {
      this._keysRaw[e.keyCode] = 1;
    }
  }

  _keyUp( e ) {
    if ( e.code ) {
      this._keysRaw[Keys.codesToKeyCodes[e.code]] = 0;
    }
    else {
      this._keysRaw[e.keyCode] = 0;
    }
  }

  _pointerEnter() {
    this.mouse.isOffScreen = false;
    this._currentMouseLeft = false;
    this._currentMouseRight = false;
  }

  _pointerMove( e ) {
    const canvasRect = this.canvas.getBoundingClientRect();
    this.mouse.position = {
      x: Math.floor( ( e.clientX - canvasRect.left ) / this.canvasScale ),
      y: this.screenHeight - Math.floor( ( e.clientY - canvasRect.top ) / this.canvasScale ) - 1,
    };
  }

  _pointerDown( e ) {
    if ( e.button === 0 ) {
      // left button
      this._currentMouseLeft = true;
      this._forceMouseLeftDown = true;
    }
    else if ( e.button === 2 ) {
      // right button
      this._currentMouseRight = true;
      this._forceMouseRightDown = true;
    }
  }

  _pointerUp( e ) {
    if ( e.button === 0 ) {
      // left button
      this._currentMouseLeft = false;
    }
    else if ( e.button === 2 ) {
      // right button
      this._currentMouseRight = false;
    }
  }

  _pointerLeave() {
    this.mouse.isOffScreen = true;
  }

  /**
   * clear out all of the input
   */
  clearInput() {
    for ( let i = 0; i < 256; i += 1 ) {
      this._keysRaw[i] = 0;
      this._lastKeys[i] = 0;
      this._currentKeys[i] = 0;
    }
  }

  /**
   * Update the input, should be done first thing in the game loop.
   */
  pollInput() {
    for ( let i = 0; i < 256; i += 1 ) {
      this._lastKeys[i] = this._currentKeys[i];
      this._currentKeys[i] = this._keysRaw[i];
    }

    this._updateButtons();

    this.mouse.left.pressed = this._forceMouseLeftDown ? true : this._currentMouseLeft;
    this.mouse.left.down = this._forceMouseLeftDown ? true : this._currentMouseLeft && !this._lastMouseLeft;
    this.mouse.left.up = !this._currentMouseLeft && this._lastMouseLeft;

    this.mouse.right.pressed = this._forceMouseRightDown ? true : this._currentMouseRight;
    this.mouse.right.down = this._forceMouseRightDown ? true : this._currentMouseRight && !this._lastMouseRight;
    this.mouse.right.up = !this._currentMouseRight && this._lastMouseRight;

    this._forceMouseLeftDown = false;
    this._forceMouseRightDown = false;

    this._lastMouseLeft = this._currentMouseLeft;
    this._lastMouseRight = this._currentMouseRight;
  }

  /**
   * return true if the key is currently held down
   * @param {number} keyCode
   */
  getKeyPressed( keyCode ) {
    if ( keyCode < 0 || keyCode >= 256 ) {
      return false;
    }

    return this._currentKeys[keyCode] > 0;
  }

  /**
   * return true if the key was pressed down this frame
   * @param {number} keyCode
   */
  getKeyDown( keyCode ) {
    if ( keyCode < 0 || keyCode >= 256 ) {
      return false;
    }

    const current = this._currentKeys[keyCode] > 0;
    const last = this._lastKeys[keyCode] > 0;
    return current && !last;
  }

  /**
   * return true if the key was released this frame
   * @param {number} keyCode
   */
  getKeyUp( keyCode ) {
    if ( keyCode < 0 || keyCode >= 256 ) {
      return false;
    }

    const current = this._currentKeys[keyCode] > 0;
    const last = this._lastKeys[keyCode] > 0;
    return !current && last;
  }

  /**
   * return true if the button is currently held down
   * @param {number} buttonCode
   */
  getButtonPressed( buttonCode ) {
    return this.getKeyPressed( this._buttonsToKeys[buttonCode] );
  }

  /**
   * return true if the button was pressed down this frame
   * @param {number} buttonCode
   */
  getButtonDown( buttonCode ) {
    return this.getKeyDown( this._buttonsToKeys[buttonCode] );
  }

  /**
   * return true if the button was released this frame
   * @param {number} buttonCode
   */
  getButtonUp( buttonCode ) {
    return this.getKeyUp( this._buttonsToKeys[buttonCode] );
  }

  _updateButtons() {
    this._updateButton( 'left', Input.GAME_LEFT );
    this._updateButton( 'right', Input.GAME_RIGHT );
    this._updateButton( 'up', Input.GAME_UP );
    this._updateButton( 'down', Input.GAME_DOWN );

    this._updateButton( 'action1', Input.GAME_ACTION_ONE );
    this._updateButton( 'action2', Input.GAME_ACTION_TWO );
    this._updateButton( 'action3', Input.GAME_ACTION_THREE );
    this._updateButton( 'action4', Input.GAME_ACTION_FOUR );
    this._updateButton( 'leftTrigger', Input.GAME_LEFT_TRIGGER );
    this._updateButton( 'rightTrigger', Input.GAME_RIGHT_TRIGGER );

    this._updateButton( 'pause', Input.GAME_PAUSE );

    this._updateButton( 'menuLeft', Input.MENU_LEFT );
    this._updateButton( 'menuRight', Input.MENU_RIGHT );
    this._updateButton( 'menuUp', Input.MENU_UP );
    this._updateButton( 'menuDown', Input.MENU_DOWN );

    this._updateButton( 'menuConfirm', Input.MENU_CONFIRM );
    this._updateButton( 'menuBack', Input.MENU_BACK );
  }

  _updateButton( name, index ) {
    const key = this._buttonsToKeys[index];
    const pressed = this.getKeyPressed( key );
    const down = this.getKeyDown( key );
    const up = this.getKeyUp( key );

    this[name] = { pressed, down, up };
  }
}

Input.GAME_LEFT = 0;
Input.GAME_RIGHT = 1;
Input.GAME_UP = 2;
Input.GAME_DOWN = 3;
Input.GAME_ACTION_ONE = 4;
Input.GAME_ACTION_TWO = 5;
Input.GAME_ACTION_THREE = 6;
Input.GAME_ACTION_FOUR = 7;
Input.GAME_PAUSE = 8;
Input.GAME_LEFT_TRIGGER = 9;
Input.GAME_RIGHT_TRIGGER = 10;

Input.MENU_LEFT = 11;
Input.MENU_RIGHT = 12;
Input.MENU_UP = 13;
Input.MENU_DOWN = 14;
Input.MENU_CONFIRM = 15;
Input.MENU_BACK = 16;

export default Input;
