

class Sound {
  constructor( data ) {
    this.volumeTics = new Int8Array( 32 );
    this.pitchTics = new Int8Array( 32 );
    this.arpTics = new Int8Array( 32 );
    this.useVolumeLoop = false;
    this.volumeLoopStart = -1;
    this.volumeLoopEnd = -1;
    this.usePitchLoop = false;
    this.pitchLoopStart = -1;
    this.pitchLoopEnd = -1;
    this.useArpLoop = false;
    this.arpLoopStart = -1;
    this.arpLoopEnd = -1;
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

    // used so the last ticked played can be viewed in the editor
    this.lastVolumeTic = 0;
    this.lastPitchTic = 0;
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
