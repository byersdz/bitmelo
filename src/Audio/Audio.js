import Sound from './Sound';
import Frequencies from './Frequencies';

const TICS_PER_SOUND = 32;

class Audio {
  constructor() {
    this.context = null;
    this.sounds = [];
  }

  init() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new AudioContext();
  }

  addSound( soundData ) {
    this.sounds.push( new Sound( soundData ) );
    return this.sounds.length - 1;
  }

  playSound( soundIndex, note, duration = 32, volume = 1, speed = 0 ) {
    if ( soundIndex >= this.sounds.length || soundIndex < 0 ) {
      console.error( 'Invalid sound index' );
      return;
    }

    const sound = this.sounds[soundIndex];

    const osc = this.context.createOscillator();

    switch ( sound.wave ) {
      case 0:
        osc.type = 'sine';
        break;
      case 1:
        osc.type = 'triangle';
        break;
      case 2:
        osc.type = 'square';
        break;
      case 3:
        osc.type = 'sawtooth';
        break;
      default:
        osc.type = 'sine';
        break;
    }

    let fullDuration = 1;

    switch ( speed ) {
      case -1:
        fullDuration = 1.5;
        break;
      case -2:
        fullDuration = 2;
        break;
      case -3:
        fullDuration = 2.5;
        break;
      case -4:
        fullDuration = 3;
        break;
      case 1:
        fullDuration = 0.75;
        break;
      case 2:
        fullDuration = 0.5;
        break;
      case 3:
        fullDuration = 0.25;
        break;
      default:
        fullDuration = 1;
        break;
    }

    const ticDuration = fullDuration / TICS_PER_SOUND;

    let trimmedNote = note;
    if ( trimmedNote < 0 ) {
      trimmedNote = 0;
    }
    else if ( trimmedNote >= Frequencies.length ) {
      trimmedNote = Frequencies.length - 1;
    }
    osc.frequency.value = Frequencies[trimmedNote];

    const gainNode = this.context.createGain();

    const initialVolume = sound.volumeTics[0] * volume;
    gainNode.gain.setValueAtTime( Audio.valueForVolume( initialVolume ), this.context.currentTime );

    osc.detune.setValueAtTime( sound.pitchTics[0] * sound.pitchScale, this.context.currentTime );

    for ( let tic = 1; tic < duration; tic += 1 ) {
      const time = this.context.currentTime + tic * ticDuration;
      const ticIndex = Audio.indexAtTic( tic, sound.useLoop, sound.loopStart, sound.loopEnd );
      const currentVolume = Audio.valueForVolume( sound.volumeTics[ticIndex] * volume );
      gainNode.gain.linearRampToValueAtTime( currentVolume, time );
      osc.detune.linearRampToValueAtTime( sound.pitchTics[ticIndex] * sound.pitchScale, time );
      const currentNote = trimmedNote + sound.arpTics[ticIndex];
      let currentFrequency = 0;
      if ( currentNote < 0 ) {
        currentFrequency = Frequencies[0];
      }
      else if ( currentNote >= Frequencies.length ) {
        currentFrequency = Frequencies[Frequencies.length - 1];
      }
      else {
        currentFrequency = Frequencies[currentNote];
      }
      osc.frequency.setValueAtTime( currentFrequency, time );
    }
    const stopTime = this.context.currentTime + ( duration * ticDuration ) + ( sound.releaseLength * ticDuration );

    if ( sound.releaseMode === Sound.RELEASE_EXPO ) {
      gainNode.gain.exponentialRampToValueAtTime( 0, stopTime );
    }
    else {
      // default to linear
      gainNode.gain.linearRampToValueAtTime( 0, stopTime );
    }
    osc.connect( gainNode ).connect( this.context.destination );
    osc.start();

    osc.stop( stopTime );
  }

  static valueForVolume( volume ) {
    const normalizedValue = volume / 15;
    return normalizedValue ** 2.5;
  }

  static indexAtTic( tic, useLoop, loopStart, loopEnd ) {
    if ( !useLoop || loopStart < 0 || loopEnd < loopStart ) {
      // no looping
      if ( tic < 0 ) {
        return 0;
      }

      if ( tic >= TICS_PER_SOUND ) {
        return TICS_PER_SOUND - 1;
      }

      return tic;
    }

    if ( tic <= loopEnd ) {
      // not looping yet
      return tic;
    }

    const loopLength = loopEnd - loopStart + 1;
    const loopAdd = ( tic - loopStart ) % loopLength;

    return loopStart + loopAdd;
  }
}

export default Audio;
