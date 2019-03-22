
class Sound {
  constructor( data ) {
    this.volumeTics = new Int8Array( 32 );
    this.pitchTics = new Int8Array( 32 );
    this.arpTics = new Int8Array( 32 );
    this.loopStart = -1;
    this.loopEnd = -1;
    this.wave = 0;
    this.pitchScale = 10;

    if ( data ) {
      const {
        volumeTics,
        pitchTics,
        arpTics,
        loopStart,
        loopEnd,
        wave,
        pitchScale,
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
      this.loopStart = loopStart;
      this.loopEnd = loopEnd;
      this.pitchScale = pitchScale;
    }
  }
}

export default Sound;
