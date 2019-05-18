import Sound from './Sound';
import Frequencies from './Frequencies';

class Audio {
  constructor() {
    this.context = null;
    this.sounds = [];
    this.lookAheadTime = 0.05; // in seconds
  }

  init() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new AudioContext();
  }


  update() {
    let sound = null;
    for ( let i = 0; i < this.sounds.length; i += 1 ) {
      sound = this.sounds[i];
      if ( sound.isPlayingInfiniteSound ) {
        const lastScheduledTime = this.context.currentTime - sound.infiniteStartTime + this.lookAheadTime;
        const totalNumberOfTics = Math.floor( lastScheduledTime / sound.infiniteTicDuration );
        if ( totalNumberOfTics > sound.infiniteTicsPlayed ) {
          for ( let tic = sound.infiniteTicsPlayed + 1; tic <= totalNumberOfTics; tic += 1 ) {
            const time = sound.infiniteStartTime + tic * sound.infiniteTicDuration;
            const ticIndex = Audio.indexAtTic( tic, sound.useLoop, sound.loopStart, sound.loopEnd );
            const currentVolume = Audio.valueForVolume( sound.volumeTics[ticIndex] ) * sound.infiniteVolume;

            sound.infiniteGain.gain.linearRampToValueAtTime( currentVolume, time );
            sound.infiniteOsc.detune.linearRampToValueAtTime( sound.pitchTics[ticIndex] * sound.pitchScale, time );
            const currentNote = sound.infiniteNote + sound.arpTics[ticIndex];
            const currentFrequency = Audio.frequencyForNote( currentNote );
            sound.infiniteOsc.frequency.setValueAtTime( currentFrequency, time );

            sound.infiniteTicsPlayed = tic;
          }
        }
      }
    }
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

    if ( duration < 0 ) {
      this.playInfiniteSound( soundIndex, note, volume, speed );
      return;
    }

    const sound = this.sounds[soundIndex];

    const osc = this.context.createOscillator();
    osc.type = Audio.oscTypeForWaveValue( sound.wave );

    const ticDuration = Audio.ticDurationForSpeedValue( speed );

    osc.frequency.value = Audio.frequencyForNote( note );

    const gainNode = this.context.createGain();

    const initialVolume = Audio.valueForVolume( sound.volumeTics[0] ) * volume;
    gainNode.gain.setValueAtTime( initialVolume, this.context.currentTime );

    osc.detune.setValueAtTime( sound.pitchTics[0] * sound.pitchScale, this.context.currentTime );

    for ( let tic = 1; tic < duration; tic += 1 ) {
      const time = this.context.currentTime + tic * ticDuration;
      const ticIndex = Audio.indexAtTic( tic, sound.useLoop, sound.loopStart, sound.loopEnd );
      const currentVolume = Audio.valueForVolume( sound.volumeTics[ticIndex] ) * volume;
      gainNode.gain.linearRampToValueAtTime( currentVolume, time );
      osc.detune.linearRampToValueAtTime( sound.pitchTics[ticIndex] * sound.pitchScale, time );
      const currentNote = note + sound.arpTics[ticIndex];
      const currentFrequency = Audio.frequencyForNote( currentNote );
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

  stopInfiniteSound( soundIndex ) {
    const sound = this.sounds[soundIndex];
    if ( sound.isPlayingInfiniteSound ) {
      const stopTime = this.context.currentTime + ( sound.releaseLength * sound.infiniteTicDuration );
      if ( sound.releaseMode === Sound.RELEASE_EXPO ) {
        sound.infiniteGain.gain.exponentialRampToValueAtTime( 0, stopTime );
      }
      else {
        // default to linear
        sound.infiniteGain.gain.linearRampToValueAtTime( 0, stopTime );
      }
      sound.infiniteTicsPlayed = 0;
      sound.infiniteOsc.stop( stopTime );
      sound.isPlayingInfiniteSound = false;
    }
  }

  stopAllInfiniteSounds() {
    for ( let i = 0; i < this.sounds.length; i += 1 ) {
      this.stopInfiniteSound( i );
    }
  }

  playInfiniteSound( soundIndex, note, volume, speed ) {
    const sound = this.sounds[soundIndex];
    if ( sound.isPlayingInfiniteSound ) {
      this.stopSound( soundIndex );
    }

    sound.isPlayingInfiniteSound = true;
    sound.infiniteStartTime = this.context.currentTime;
    sound.infiniteOsc = this.context.createOscillator();
    sound.infiniteTicDuration = Audio.ticDurationForSpeedValue( speed );
    sound.infiniteGain = this.context.createGain();
    sound.infiniteVolume = volume;
    sound.infiniteNote = note;

    sound.infiniteOsc.frequency.value = Audio.frequencyForNote( note );
    sound.infiniteOsc.type = Audio.oscTypeForWaveValue( sound.wave );

    const initialVolume = Audio.valueForVolume( sound.volumeTics[0] ) * volume;
    sound.infiniteGain.gain.setValueAtTime( initialVolume, this.context.currentTime );

    sound.infiniteOsc.connect( sound.infiniteGain ).connect( this.context.destination );
    sound.infiniteOsc.start();
  }

  static frequencyForNote( note ) {
    let trimmedNote = note;
    if ( trimmedNote < 0 ) {
      trimmedNote = 0;
    }
    else if ( trimmedNote >= Frequencies.length ) {
      trimmedNote = Frequencies.length - 1;
    }
    return Frequencies[trimmedNote];
  }

  static ticDurationForSpeedValue( speed ) {
    return Audio.fullDurationForSpeedValue( speed ) / Audio.TICS_PER_SOUND;
  }

  static fullDurationForSpeedValue( speed ) {
    switch ( speed ) {
      case -1:
        return 1.5;
      case -2:
        return 2;
      case -3:
        return 2.5;
      case -4:
        return 3;
      case 1:
        return 0.75;
      case 2:
        return 0.5;
      case 3:
        return 0.25;
      default:
        return 1;
    }
  }

  static oscTypeForWaveValue( waveValue ) {
    switch ( waveValue ) {
      case 0:
        return 'sine';
      case 1:
        return 'triangle';
      case 2:
        return 'square';
      case 3:
        return 'sawtooth';
      default:
        return 'sine';
    }
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

      if ( tic >= Audio.TICS_PER_SOUND ) {
        return Audio.TICS_PER_SOUND - 1;
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

Audio.TICS_PER_SOUND = 32;

export default Audio;
