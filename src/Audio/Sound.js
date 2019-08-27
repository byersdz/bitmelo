
/**
 * Represents a sound that can be played.
 */
class Sound {
  constructor( data ) {
    /**
     * Array of volume values for the duration of the sound.
     * Each value must be 0 to 15.
     * Length of the array must always be 32.
     */
    this.volumeTics = new Int8Array( 32 );

    /**
     * Array of pitch values for the duration of the sound.
     * Each value must be -10 to 10.
     * Length of the array must always be 32.
     */
    this.pitchTics = new Int8Array( 32 );

    /**
     * Array of arp values for the duration of the sound.
     * Each value is the number of notes above or below the note of the sound.
     * Length of the array must always be 32.
     */
    this.arpTics = new Int8Array( 32 );

    /**
     * Should we loop over the volumeTics when playing a sound?
     * If false the last volume tic will be played infinitely once reaching it.
     */
    this.useVolumeLoop = false;

    /**
     * The volumeTics index we will start looping at if useVolumeLoop is true.
     */
    this.volumeLoopStart = -1;

    /**
     * The volumeTics index we will stop looping at if useVolumeLoop is true.
     */
    this.volumeLoopEnd = -1;

    /**
     * Should we loop over the pitchTics when playing a sound?
     * If false the last pitch tic will be played infinitely once reaching it.
     */
    this.usePitchLoop = false;

    /**
     * The pitchTics index we will start looping at if usePitchLoop is true.
     */
    this.pitchLoopStart = -1;

    /**
     * The pitchTics index we will stop looping at if usePitchLoop is true.
     */
    this.pitchLoopEnd = -1;

    /**
     * Should we loop over the arpTics when playing a sound?
     * If false the last arp tic will be played infinitely once reaching it.
     */
    this.useArpLoop = false;

    /**
     * The arpTics index we will start looping at if useArpLoop is true.
     */
    this.arpLoopStart = -1;

    /**
     * The arpTics index we will stop looping at id useArpLoop is true.
     */
    this.arpLoopEnd = -1;

    /**
     * The Wave index used by this sound.
     * 0 is Sine.
     * 1 is Triangle.
     * 2 is Square.
     * 3 is Sawtooth.
     */
    this.wave = 0;

    /**
     * The pitch scale used by the pitchTics. Value is in cents.
     */
    this.pitchScale = 10;

    /**
     * Number of tics to ramp down playing of the sound.
     * Must always be at least 1.
     */
    this.releaseLength = 1;

    /**
     * The ramp type used when ramping down after stopping a sound.
     * 'linear' uses a linear ramp
     * 'expo' uses an exponential ramp
     */
    this.releaseMode = Sound.RELEASE_LINEAR;

    /**
     * Is an infinite sound currently playing on this sound?
     */
    this.isPlayingInfiniteSound = false;

    /**
     * The start time of the current infinite sound.
     */
    this.infiniteStartTime = 0;

    /**
     * The oscillator node of the current infinite sound.
     */
    this.infiniteOsc = null;

    /**
     * The gain node of the current infinite sound.
     */
    this.infiniteGain = null;

    /**
     * The duration of a tic in the current infinite sound.
     */
    this.infiniteTicDuration = 0;

    /**
     * The number of tics played in the current infinite sound.
     */
    this.infiniteTicsPlayed = 0;

    /**
     * The volume of the current infinite sound.
     */
    this.infiniteVolume = 0;

    /**
     * The note of the current infinite sound.
     */
    this.infiniteNote = 0;

    /**
     * The last volume tic played.
     */
    this.lastVolumeTic = 0;

    /**
     * The last pitch tic played.
     */
    this.lastPitchTic = 0;

    /**
     * The last arp tic played.
     */
    this.lastArpTic = 0;

    if ( data ) {
      const {
        volumeTics,
        pitchTics,
        arpTics,
        wave,
        pitchScale,
        releaseLength,
        releaseMode,
        useVolumeLoop,
        volumeLoopStart,
        volumeLoopEnd,
        usePitchLoop,
        pitchLoopStart,
        pitchLoopEnd,
        useArpLoop,
        arpLoopStart,
        arpLoopEnd,
      } = data;

      if ( volumeTics && Array.isArray( volumeTics ) ) {
        for ( let i = 0; i < volumeTics.length; i += 1 ) {
          this.volumeTics[i] = volumeTics[i];
        }
      }

      if ( pitchTics && Array.isArray( pitchTics ) ) {
        for ( let i = 0; i < pitchTics.length; i += 1 ) {
          this.pitchTics[i] = pitchTics[i];
        }
      }

      if ( arpTics && Array.isArray( arpTics ) ) {
        for ( let i = 0; i < arpTics.length; i += 1 ) {
          this.arpTics[i] = arpTics[i];
        }
      }

      this.wave = wave;
      this.pitchScale = pitchScale;
      this.releaseLength = releaseLength;
      this.releaseMode = releaseMode;
      this.useVolumeLoop = useVolumeLoop;
      this.volumeLoopStart = volumeLoopStart;
      this.volumeLoopEnd = volumeLoopEnd;
      this.usePitchLoop = usePitchLoop;
      this.pitchLoopStart = pitchLoopStart;
      this.pitchLoopEnd = pitchLoopEnd;
      this.useArpLoop = useArpLoop;
      this.arpLoopStart = arpLoopStart;
      this.arpLoopEnd = arpLoopEnd;
    }
  }
}

Sound.RELEASE_LINEAR = 'linear';
Sound.RELEASE_EXPO = 'expo';

export default Sound;
