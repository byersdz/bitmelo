import Keys from './Keys';

const allowDefaultKeys = [
  27,
  112,
  113,
  114,
  115,
  116,
  117,
  118,
  119,
  120,
  121,
  122,
  123,
];

/**
 * Handle game input
 */
class Input {
  constructor() {
    /**
     * Reference to the canvas used for mouse input.
     * Automatically added by the Engine.
     */
    this.canvas = null;

    /**
     * The scale of the canvas, aka the pixel size.
     * Added automatically by the Engine
     */
    this.canvasScale = 1;

    /**
     * The width of the game screen.
     * Not affected by this.canvasScale.
     * Added automatically by the Engine.
     */
    this.screenWidth = 1;

    /**
     * The height of the game screen.
     * Not affected by this.canvasScale.
     * Added automatically by the Engine.
     */
    this.screenHeight = 1;

    /**
     * Object containing input state of the mouse.
     * mouse.isOffScreen,
     * mouse.position.x,
     * mouse.position.y,
     * mouse.left.pressed,
     * mouse.left.down,
     * mouse.left.up,
     * mouse.right.pressed,
     * mouse.right.down,
     * mouse.right.up
     */
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

    /**
     * Caches keyboard key states.
     */
    this._keysRaw = new Uint8ClampedArray( 256 );

    /**
     * Keyboard states for the current frame
     */
    this._currentKeys = new Uint8ClampedArray( 256 );

    /**
     * Keyboard states for the last frame
     */
    this._lastKeys = new Uint8ClampedArray( 256 );

    /**
     * Maps standard game buttons to keyboard keys.
     */
    this._buttonsToKeys = new Uint8ClampedArray( 32 );

    /**
     * Maps standard game buttons to alternate keyboard keys
     */
    this._buttonsToAltKeys = new Uint8ClampedArray( 32 );

    /**
     * gamepad button states for the current frame
     */
    this._currentJoyButtons = new Uint8ClampedArray( 20 );

    /**
     * gamepad button states for the last frame
     */
    this._lastJoyButtons = new Uint8ClampedArray( 20 );


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

    this._buttonsToKeys[Input.MENU_CONFIRM] = Keys.Z_KEY;
    this._buttonsToKeys[Input.MENU_BACK] = Keys.X_KEY;

    // default alt button mappings
    this._buttonsToAltKeys[Input.GAME_LEFT] = Keys.J_KEY;
    this._buttonsToAltKeys[Input.GAME_RIGHT] = Keys.L_KEY;
    this._buttonsToAltKeys[Input.GAME_UP] = Keys.I_KEY;
    this._buttonsToAltKeys[Input.GAME_DOWN] = Keys.K_KEY;

    this._buttonsToAltKeys[Input.GAME_ACTION_ONE] = Keys.SPACE;
    this._buttonsToAltKeys[Input.GAME_ACTION_TWO] = Keys.D_KEY;
    this._buttonsToAltKeys[Input.GAME_ACTION_THREE] = Keys.C_KEY;
    this._buttonsToAltKeys[Input.GAME_ACTION_FOUR] = Keys.V_KEY;
    this._buttonsToAltKeys[Input.GAME_LEFT_TRIGGER] = Keys.SHIFT;
    this._buttonsToAltKeys[Input.GAME_RIGHT_TRIGGER] = Keys.ALT;

    this._buttonsToAltKeys[Input.GAME_PAUSE] = Keys.ENTER;

    this._buttonsToAltKeys[Input.MENU_LEFT] = Keys.J_KEY;
    this._buttonsToAltKeys[Input.MENU_RIGHT] = Keys.L_KEY;
    this._buttonsToAltKeys[Input.MENU_UP] = Keys.I_KEY;
    this._buttonsToAltKeys[Input.MENU_DOWN] = Keys.K_KEY;

    this._buttonsToAltKeys[Input.MENU_CONFIRM] = Keys.SPACE;
    this._buttonsToAltKeys[Input.MENU_BACK] = Keys.D_KEY;

    /**
     * Standard game button states for the current frame.
     */
    this._currentButtons = new Uint8ClampedArray( 32 );

    /**
     * Standard game button states for the last frame.
     */
    this._lastButtons = new Uint8ClampedArray( 32 );

    /**
     * Is the left mouse button down this frame?
     */
    this._currentMouseLeft = false;
    /**
     * Was the left mouse button down last frame?
     */
    this._lastMouseLeft = false;

    /**
     * Force the left mouse button state to be down this frame.
     * Used for the edge case in which a mouse button is clicked up and down all in the span of one frame.
     */
    this._forceMouseLeftDown = false;

    /**
     * Is the right mouse button down this frame?
     */
    this._currentMouseRight = false;

    /**
     * Was the right mouse button down last frame?
     */
    this._lastMouseRight = false;

    /**
     * Force the right mouse button state to be down this frame.
     * Used for the edge case in which a mouse button is clicked up and down all in the span of one frame.
     */
    this._forceMouseRightDown = false;

    /**
     * This mode runs the engine without drawing to a canvas or playing audio.
     * This is useful to use the engine to generate image data.
     */
    this.dataOnlyMode = false;
  }

  /**
   * Do initial setup. Add event listeners.
   */
  init() {
    if ( this.dataOnlyMode ) {
      return;
    }

    window.addEventListener( 'keydown', this._keyDown.bind( this ), false );
    window.addEventListener( 'keyup', this._keyUp.bind( this ), false );

    window.onfocus = () => {
      this.clearInput();
    };

    window.onblur = () => {
      this.clearInput();
    };

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

  /**
   * handle window keydown events
   * @param {*} e
   */
  _keyDown( e ) {
    // prevent default on all keys but escape and function keys
    if ( !allowDefaultKeys.includes( e.which ) ) {
      e.preventDefault();
    }

    if ( e.code ) {
      this._keysRaw[Keys.codesToKeyCodes[e.code]] = 1;
    }
    else {
      this._keysRaw[e.keyCode] = 1;
    }
  }

  /**
   * handle window keyup events
   * @param {*} e
   */
  _keyUp( e ) {
    if ( e.code ) {
      this._keysRaw[Keys.codesToKeyCodes[e.code]] = 0;
    }
    else {
      this._keysRaw[e.keyCode] = 0;
    }
  }

  /**
   * Handle pointerenter event
   */
  _pointerEnter() {
    this.mouse.isOffScreen = false;
    this._currentMouseLeft = false;
    this._currentMouseRight = false;
  }

  /**
   * Handle pointermove event
   * @param {*} e
   */
  _pointerMove( e ) {
    const canvasRect = this.canvas.getBoundingClientRect();
    this.mouse.position = {
      x: Math.floor( ( e.clientX - canvasRect.left ) / this.canvasScale ),
      y: this.screenHeight - Math.floor( ( e.clientY - canvasRect.top ) / this.canvasScale ) - 1,
    };
  }

  /**
   * Handle pointerdown event
   * @param {*} e
   */
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

  /**
   * handle pointerup event
   * @param {*} e
   */
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

  /**
   * handle pointerleave event
   */
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
   * Called automatically by the Engine.
   */
  pollInput() {
    for ( let i = 0; i < 20; i += 1 ) {
      this._lastJoyButtons[i] = this._currentJoyButtons[i];
      this._currentJoyButtons[i] = 0;
    }

    try {
      const gamePads = navigator.getGamepads();
      for ( let i = 0; i < gamePads.length; i += 1 ) {
        const gamePad = gamePads[i];
        if ( gamePad ) {
          for ( let b = 0; b < gamePad.buttons.length; b += 1 ) {
            if ( b < 20 && gamePad.buttons[i].pressed ) {
              this._currentJoyButtons[i] = 1;
            }
          }
        }
      }
    }
    // eslint-disable-next-line no-empty
    catch ( err ) {}

    for ( let i = 0; i < 256; i += 1 ) {
      this._lastKeys[i] = this._currentKeys[i];
      this._currentKeys[i] = this._keysRaw[i];
    }
    // index 0 is always off
    this._lastKeys[0] = 0;
    this._currentKeys[0] = 0;

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
   * return true if the standard game button is currently held down
   * @param {number} buttonCode
   */
  getButtonPressed( buttonCode ) {
    const key = this._buttonsToKeys[buttonCode];
    const altKey = this._buttonsToAltKeys[buttonCode];

    const keyPressed = this._currentKeys[key];
    const altKeyPressed = this._currentKeys[altKey];
    return keyPressed || altKeyPressed;
  }

  /**
   * return true if the standard game button was pressed down this frame
   * @param {number} buttonCode
   */
  getButtonDown( buttonCode ) {
    const currentPressed = this.getButtonPressed( buttonCode );

    if ( currentPressed ) {
      const key = this._buttonsToKeys[buttonCode];
      const altKey = this._buttonsToAltKeys[buttonCode];

      const lastKeyPressed = this._lastKeys[key];
      const lastAltKeyPressed = this._lastKeys[altKey];

      if ( !lastKeyPressed && !lastAltKeyPressed ) {
        return true;
      }
    }

    return false;
  }

  /**
   * return true if the standard game button was released this frame
   * @param {number} buttonCode
   */
  getButtonUp( buttonCode ) {
    const currentPressed = this.getButtonPressed( buttonCode );

    if ( !currentPressed ) {
      const key = this._buttonsToKeys[buttonCode];
      const altKey = this._buttonsToAltKeys[buttonCode];

      const lastKeyPressed = this._lastKeys[key];
      const lastAltKeyPressed = this._lastKeys[altKey];

      if ( lastKeyPressed || lastAltKeyPressed ) {
        return true;
      }
    }

    return false;
  }

  /**
   * update standard game button states.
   */
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

  /**
   * Update the state for a standard game button.
   * @param {*} name
   * @param {*} index
   */
  _updateButton( name, index ) {
    const pressed = this.getButtonPressed( index );
    const down = this.getButtonDown( index );
    const up = this.getButtonUp( index );

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
