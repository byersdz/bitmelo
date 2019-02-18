import * as Keys from './Keys';

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

    this._currentMouseLeft = false;
    this._lastMouseLeft = false;
    this._forceMouseLeftDown = false;

    this._currentMouseRight = false;
    this._lastMouseRight = false;
    this._forceMouseRightDown = false;
  }

  init() {
    window.addEventListener( 'keydown', this._keyDown.bind( this ), false );
    window.addEventListener( 'keyup', this._keyUp.bind( this ), false );

    if ( this.canvas ) {
      this.canvas.oncontextmenu = ( e ) => {
        e.preventDefault();
      };

      this.canvas.addEventListener( 'mouseenter', this._mouseEnter.bind( this ), false );
      this.canvas.addEventListener( 'mousemove', this._mouseMove.bind( this ), false );
      this.canvas.addEventListener( 'mousedown', this._mouseDown.bind( this ), false );
      this.canvas.addEventListener( 'mouseup', this._mouseUp.bind( this ), false );
      this.canvas.addEventListener( 'mouseleave', this._mouseLeave.bind( this ), false );
    }
  }

  _keyDown( e ) {
    this._keysRaw[e.keyCode] = 1;
  }

  _keyUp( e ) {
    this._keysRaw[e.keyCode] = 0;
  }

  _mouseEnter() {
    this.mouse.isOffScreen = false;
    this._currentMouseLeft = false;
    this._currentMouseRight = false;
  }

  _mouseMove( e ) {
    const canvasRect = this.canvas.getBoundingClientRect();
    this.mouse.position = {
      x: Math.floor( ( e.clientX - canvasRect.left ) / this.canvasScale ),
      y: this.screenHeight - Math.floor( ( e.clientY - canvasRect.top ) / this.canvasScale ) - 1,
    };
  }

  _mouseDown( e ) {
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

  _mouseUp( e ) {
    if ( e.button === 0 ) {
      // left button
      this._currentMouseLeft = false;
    }
    else if ( e.button === 2 ) {
      // right button
      this._currentMouseRight = false;
    }
  }

  _mouseLeave() {
    this.mouse.isOffScreen = true;
  }

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
