
class Audio {
  constructor() {
    this.context = null;
  }

  init() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new AudioContext();
  }

  playSound() {
    const osc = this.context.createOscillator();
    osc.type = 'square';
    osc.frequency.value = 440;
    osc.connect( this.context.destination );
    osc.start();
    osc.stop( this.context.currentTime + 1 );
  }
}

export default Audio;
