import Sound from './Sound';
import Frequencies from './Frequencies';

/**
 * Handles playing of audio and adding audio data.
 */
class Audio {
  constructor() {
    /**
     * The AudioContext used. Created in init.
     */
    this.context = null;

    /**
     * Array of sounds used, of the Sound class type.
     * Add a sound from data using the addSound method.
     */
    this.sounds = [];

    /**
     * Time in second we should look ahead during update to add audio events to the context.
     */
    this.lookAheadTime = 0.05; // in seconds

    /**
     * This mode runs the engine without drawing to a canvas or playing audio.
     * This is useful to use the engine to generate image data.
     */
    this.dataOnlyMode = false;
  }

  /**
   * Initialize the audio context. Called automatically by the Engine.
   */
  init() {
    if ( this.dataOnlyMode ) {
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new AudioContext();
  }

  /**
   * Update audio events. Called automatically by the Engine in the update loop.
   */
  update() {
    if ( this.dataOnlyMode ) {
      return;
    }

    let sound = null;
    for ( let i = 0; i < this.sounds.length; i += 1 ) {
      sound = this.sounds[i];
      if ( sound.isPlayingInfiniteSound ) {
        const lastScheduledTime = this.context.currentTime - sound.infiniteStartTime + this.lookAheadTime;
        const totalNumberOfTics = Math.floor( lastScheduledTime / sound.infiniteTicDuration );
        if ( totalNumberOfTics > sound.infiniteTicsPlayed ) {
          let volumeTicIndex = 0;
          let pitchTicIndex = 0;
          let arpTicIndex = 0;
          for ( let tic = sound.infiniteTicsPlayed + 1; tic <= totalNumberOfTics; tic += 1 ) {
            const time = sound.infiniteStartTime + tic * sound.infiniteTicDuration;
            volumeTicIndex = Audio.indexAtTic(
              tic, sound.useVolumeLoop,
              sound.volumeLoopStart,
              sound.volumeLoopEnd,
            );
            pitchTicIndex = Audio.indexAtTic( tic, sound.usePitchLoop, sound.pitchLoopStart, sound.pitchLoopEnd );
            arpTicIndex = Audio.indexAtTic( tic, sound.useArpLoop, sound.arpLoopStart, sound.arpLoopEnd );

            const currentVolume = Audio.valueForVolume( sound.volumeTics[volumeTicIndex] )
              * Audio.linearToAdjustedVolume( sound.infiniteVolume );

            sound.infiniteGain.gain.linearRampToValueAtTime( currentVolume, time );
            sound.infiniteOsc.detune.linearRampToValueAtTime( sound.pitchTics[pitchTicIndex] * sound.pitchScale, time );
            const currentNote = sound.infiniteNote + sound.arpTics[arpTicIndex];
            const currentFrequency = Audio.frequencyForNote( currentNote );
            sound.infiniteOsc.frequency.setValueAtTime( currentFrequency, time );

            sound.infiniteTicsPlayed = tic;
          }

          sound.lastVolumeTic = volumeTicIndex;
          sound.lastPitchTic = pitchTicIndex;
          sound.lastArpTic = arpTicIndex;
        }
      }
    }
  }

  /**
   * Add a Sound instance to the sounds array from data.
   * @param {*} soundData
   */
  addSound( soundData ) {
    this.sounds.push( new Sound( soundData ) );
    return this.sounds.length - 1;
  }

  /**
   * Play a sound
   * @param {*} soundIndex
   * @param {*} note
   * @param {*} duration
   * @param {*} volume
   * @param {*} speed
   */
  playSound( soundIndex, note, duration = 32, volume = 1, speed = 0 ) {
    if ( this.dataOnlyMode ) {
      return;
    }

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

    const initialVolume = Audio.valueForVolume( sound.volumeTics[0] ) * Audio.linearToAdjustedVolume( volume );
    gainNode.gain.setValueAtTime( initialVolume, this.context.currentTime );

    osc.detune.setValueAtTime( sound.pitchTics[0] * sound.pitchScale, this.context.currentTime );

    for ( let tic = 1; tic < duration; tic += 1 ) {
      const time = this.context.currentTime + tic * ticDuration;
      const volumeTicIndex = Audio.indexAtTic( tic, sound.useVolumeLoop, sound.volumeLoopStart, sound.volumeLoopEnd );
      const pitchTicIndex = Audio.indexAtTic( tic, sound.usePitchLoop, sound.pitchLoopStart, sound.pitchLoopEnd );
      const arpTicIndex = Audio.indexAtTic( tic, sound.useArpLoop, sound.arpLoopStart, sound.arpLoopEnd );

      const currentVolume = Audio.valueForVolume( sound.volumeTics[volumeTicIndex] )
        * Audio.linearToAdjustedVolume( volume );

      gainNode.gain.linearRampToValueAtTime( currentVolume, time );
      osc.detune.linearRampToValueAtTime( sound.pitchTics[pitchTicIndex] * sound.pitchScale, time );
      const currentNote = note + sound.arpTics[arpTicIndex];
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

  /**
   * Stop a sound that is being played infinitely
   * @param {*} soundIndex
   */
  stopInfiniteSound( soundIndex ) {
    const sound = this.sounds[soundIndex];
    if ( sound.isPlayingInfiniteSound ) {
      const stopTime = this.context.currentTime + ( sound.releaseLength * sound.infiniteTicDuration );
      if ( sound.releaseMode === Sound.RELEASE_EXPO ) {
        try {
          sound.infiniteGain.gain.exponentialRampToValueAtTime( 0.01, stopTime );
        }
        catch ( err ) {
          sound.infiniteGain.gain.linearRampToValueAtTime( 0, stopTime );
        }
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

  /**
   * Stop all infinitely playing sounds
   */
  stopAllInfiniteSounds() {
    for ( let i = 0; i < this.sounds.length; i += 1 ) {
      this.stopInfiniteSound( i );
    }
  }

  /**
   * Play a sound infinitely. Only one instance of a sound at each index can be played at a time.
   * @param {*} soundIndex
   * @param {*} note
   * @param {*} volume
   * @param {*} speed
   */
  playInfiniteSound( soundIndex, note, volume, speed ) {
    if ( this.dataOnlyMode ) {
      return;
    }

    const sound = this.sounds[soundIndex];
    if ( sound.isPlayingInfiniteSound ) {
      this.stopInfiniteSound( soundIndex );
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

  /**
   * Get the frequency in hertz for a note number.
   * @param {*} note
   */
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

  /**
   * Get the duration in seconds for a tic at a given speed number.
   * @param {*} speed
   */
  static ticDurationForSpeedValue( speed ) {
    return Audio.fullDurationForSpeedValue( speed ) / Audio.TICS_PER_SOUND;
  }

  /**
   * Get the total length of a sound in seconds for a given speed number
   * @param {*} speed
   */
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

  /**
   * Get the wave type for a wave index
   * @param {*} waveValue
   */
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

  /**
   * Get a 0 - 1 volume value for a 0 - 15 value used by the Sound class.
   * @param {*} volume
   */
  static valueForVolume( volume ) {
    const normalizedValue = volume / 15;
    return normalizedValue ** 2.5;
  }

  /**
   * Adjust a linear volume value to account for human hearing.
   * @param {*} volume
   */
  static linearToAdjustedVolume( volume ) {
    return volume ** 2.5;
  }

  /**
   * Get the current tic index, taking into account looping.
   * @param {*} tic
   * @param {*} useLoop
   * @param {*} loopStart
   * @param {*} loopEnd
   */
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
