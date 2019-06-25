
const Keys = {};

Keys.BACKSPACE = 8;
Keys.TAB = 9;
Keys.ENTER = 13;
Keys.SHIFT = 16;
Keys.CTRL = 17;
Keys.ALT = 18;
Keys.PAUSE_BREAK = 19;
Keys.CAPSLOCK = 20;
Keys.ESCAPE = 27;
Keys.SPACE = 32;
Keys.PAGE_UP = 33;
Keys.PAGE_DOWN = 34;
Keys.END = 35;
Keys.HOME = 36;
Keys.LEFT_ARROW = 37;
Keys.UP_ARROW = 38;
Keys.RIGHT_ARROW = 39;
Keys.DOWN_ARROW = 40;
Keys.INSERT = 45;
Keys.DELETE = 46;
Keys.ZERO = 48;
Keys.ONE = 49;
Keys.TWO = 50;
Keys.THREE = 51;
Keys.FOUR = 52;
Keys.FIVE = 53;
Keys.SIX = 54;
Keys.SEVEN = 55;
Keys.EIGHT = 56;
Keys.NINE = 57;
Keys.A_KEY = 65;
Keys.B_KEY = 66;
Keys.C_KEY = 67;
Keys.D_KEY = 68;
Keys.E_KEY = 69;
Keys.F_KEY = 70;
Keys.G_KEY = 71;
Keys.H_KEY = 72;
Keys.I_KEY = 73;
Keys.J_KEY = 74;
Keys.K_KEY = 75;
Keys.L_KEY = 76;
Keys.M_KEY = 77;
Keys.N_KEY = 78;
Keys.O_KEY = 79;
Keys.P_KEY = 80;
Keys.Q_KEY = 81;
Keys.R_KEY = 82;
Keys.S_KEY = 83;
Keys.T_KEY = 84;
Keys.U_KEY = 85;
Keys.V_KEY = 86;
Keys.W_KEY = 87;
Keys.X_KEY = 88;
Keys.Y_KEY = 89;
Keys.Z_KEY = 90;
Keys.LEFT_WINDOW = 91;
Keys.RIGHT_WINDOW = 92;
Keys.SELECT = 93;
Keys.NUM_ZERO = 96;
Keys.NUM_ONE = 97;
Keys.NUM_TWO = 98;
Keys.NUM_THREE = 99;
Keys.NUM_FOUR = 100;
Keys.NUM_FIVE = 101;
Keys.NUM_SIX = 102;
Keys.NUM_SEVEN = 103;
Keys.NUM_EIGHT = 104;
Keys.NUM_NINE = 105;
Keys.MULTIPLY = 106;
Keys.ADD = 107;
Keys.SUBTRACT = 109;
Keys.DECIMAL_POINT = 110;
Keys.DIVIDE = 111;
Keys.F1 = 112;
Keys.F2 = 113;
Keys.F3 = 114;
Keys.F4 = 115;
Keys.F5 = 116;
Keys.F6 = 117;
Keys.F7 = 118;
Keys.F8 = 119;
Keys.F9 = 120;
Keys.F10 = 121;
Keys.F11 = 122;
Keys.F12 = 123;
Keys.NUM_LOCK = 144;
Keys.SCROLL_LOCK = 145;
Keys.SEMI_COLON = 186;
Keys.EQUAL_SIGN = 187;
Keys.COMMA = 188;
Keys.DASH = 189;
Keys.PERIOD = 190;
Keys.FORWARD_SLASH = 191;
Keys.GRAVE_ACCENT = 192;
Keys.OPEN_BRACKET = 219;
Keys.BACK_SLASH = 220;
Keys.CLOSE_BRACKET = 221;
Keys.SINGLE_QUOTE = 222;

Keys.codesToKeyCodes = {
  Backspace: Keys.BACKSPACE,
  Tab: Keys.TAB,
  Enter: Keys.ENTER,
  ShiftLeft: Keys.SHIFT,
  ShiftRight: Keys.SHIFT,
  ControlLeft: Keys.CTRL,
  ControlRight: Keys.CTRL,
  AltLeft: Keys.ALT,
  AltRight: Keys.ALT,
  CapsLock: Keys.CAPSLOCK,
  Escape: Keys.ESCAPE,
  Space: Keys.SPACE,
  PageUp: Keys.PAGE_UP,
  PageDown: Keys.PAGE_DOWN,
  End: Keys.END,
  Home: Keys.HOME,
  ArrowLeft: Keys.LEFT_ARROW,
  ArrowUp: Keys.UP_ARROW,
  ArrowRight: Keys.RIGHT_ARROW,
  ArrowDown: Keys.DOWN_ARROW,
  Insert: Keys.INSERT,
  Delete: Keys.DELETE,
  Digit0: Keys.ZERO,
  Digit1: Keys.ONE,
  Digit2: Keys.TWO,
  Digit3: Keys.THREE,
  Digit4: Keys.FOUR,
  Digit5: Keys.FIVE,
  Digit6: Keys.SIX,
  Digit7: Keys.SEVEN,
  Digit8: Keys.EIGHT,
  Digit9: Keys.NINE,
  KeyA: Keys.A_KEY,
  KeyB: Keys.B_KEY,
  KeyC: Keys.C_KEY,
  KeyD: Keys.D_KEY,
  KeyE: Keys.E_KEY,
  KeyF: Keys.F_KEY,
  KeyG: Keys.G_KEY,
  KeyH: Keys.H_KEY,
  KeyI: Keys.I_KEY,
  KeyJ: Keys.J_KEY,
  KeyK: Keys.K_KEY,
  KeyL: Keys.L_KEY,
  KeyM: Keys.M_KEY,
  KeyN: Keys.N_KEY,
  KeyO: Keys.O_KEY,
  KeyP: Keys.P_KEY,
  KeyQ: Keys.Q_KEY,
  KeyR: Keys.R_KEY,
  KeyS: Keys.S_KEY,
  KeyT: Keys.T_KEY,
  KeyU: Keys.U_KEY,
  KeyV: Keys.V_KEY,
  KeyW: Keys.W_KEY,
  KeyX: Keys.X_KEY,
  KeyY: Keys.Y_KEY,
  KeyZ: Keys.Z_KEY,
  Select: Keys.SELECT,
  Numpad0: Keys.NUM_ZERO,
  Numpad1: Keys.NUM_ONE,
  Numpad2: Keys.NUM_TWO,
  Numpad3: Keys.NUM_THREE,
  Numpad4: Keys.NUM_FOUR,
  Numpad5: Keys.NUM_FIVE,
  Numpad6: Keys.NUM_SIX,
  Numpad7: Keys.NUM_SEVEN,
  Numpad8: Keys.NUM_EIGHT,
  Numpad9: Keys.NUM_NINE,
  NumpadMultiply: Keys.MULTIPLY,
  NumpadAdd: Keys.ADD,
  NumpadSubtract: Keys.SUBTRACT,
  NumpadDecimal: Keys.DECIMAL_POINT,
  NumpadDivide: Keys.DIVIDE,
  F1: Keys.F1,
  F2: Keys.F2,
  F3: Keys.F3,
  F4: Keys.F4,
  F5: Keys.F5,
  F6: Keys.F6,
  F7: Keys.F7,
  F8: Keys.F8,
  F9: Keys.F9,
  F10: Keys.F10,
  F11: Keys.F11,
  F12: Keys.F12,
  NumLock: Keys.NUM_LOCK,
  ScrollLock: Keys.SCROLL_LOCK,
  Semicolon: Keys.SEMI_COLON,
  Equal: Keys.EQUAL_SIGN,
  NumpadEqual: Keys.EQUAL_SIGN,
  Comma: Keys.COMMA,
  NumpadComma: Keys.COMMA,
  Period: Keys.PERIOD,
  Slash: Keys.FORWARD_SLASH,
  Backquote: Keys.GRAVE_ACCENT,
  BracketLeft: Keys.OPEN_BRACKET,
  Backslash: Keys.BACK_SLASH,
  BracketRight: Keys.CLOSE_BRACKET,
  Quote: Keys.SINGLE_QUOTE,
  Minus: Keys.DASH,
  NumpadEnter: Keys.ENTER,
};

export default Keys;
