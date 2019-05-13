

class Sound {
  constructor( data ) {
    this.volumeTics = new Int8Array( 32 );
    this.pitchTics = new Int8Array( 32 );
    this.arpTics = new Int8Array( 32 );
    this.useLoop = false;
    this.loopStart = -1;
    this.loopEnd = -1;
    this.wave = 0;
    this.pitchScale = 10;
    this.releaseLength = 1;
    this.releaseMode = Sound.RELEASE_LINEAR;

    this.isPlayingInfiniteSound = false;
    this.infiniteStartTime = 0;
    this.infiniteOsc = null;
    this.infiniteGain = null;
    this.infiniteTicDuration = 0;
    this.infiniteTicsPlayed = 0;
    this.infiniteVolume = 0;
    this.infiniteNote = 0;

    if ( data ) {
      const {
        volumeTics,
        pitchTics,
        arpTics,
        useLoop,
        loopStart,
        loopEnd,
        wave,
        pitchScale,
        releaseLength,
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
      this.useLoop = useLoop;
      this.loopStart = loopStart;
      this.loopEnd = loopEnd;
      this.pitchScale = pitchScale;
      this.releaseLength = releaseLength;
    }
  }
}

Sound.RELEASE_LINEAR = 'linear';
Sound.RELEASE_EXPO = 'expo';

export default Sound;
