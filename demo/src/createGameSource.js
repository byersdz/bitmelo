import cloneDeep from 'lodash/cloneDeep';
import { libText, Builder } from '../../src/index';

function createGameSource( projectData, testScript = '' ) {
  const projectCopy = cloneDeep( projectData );

  if ( projectCopy.tileset && projectCopy.tileset.present ) {
    projectCopy.tileset = projectCopy.tileset.present;
  }
  if ( projectCopy.tilemap && projectCopy.tilemap.present ) {
    projectCopy.tilemap = projectCopy.tilemap.present;
  }

  const { scripts } = projectCopy.code;
  delete projectCopy.code;
  let scriptsString = '';

  for ( let i = 0; i < scripts.length; i += 1 ) {
    scriptsString += scripts[i].text;
  }

  if ( testScript ) {
    scriptsString = testScript;
  }

  scriptsString = Builder.instrumentScript( scriptsString );

  const style = `
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #000;
      }

      #bitmelo-container {
        margin: 0 auto;
        margin-top: 16px;
        padding: 0;
      }

      #bitmelo-container canvas {
        margin: auto;
        display: block;

      }
    </style>
  `;

  const result = `
  <html>
    <head>
      ${ style }
    </head>
    <body>
      <div id="main-container">
        <div id="bitmelo-container"></div>
      </div>
      <script>
        ${ libText }
        const engine = new bitmelo.Engine();
        const projectData = ${ JSON.stringify( projectCopy ) };
        engine.addProjectData( projectData );

        ${ scriptsString }
        engine.begin();
      </script>
    </body>
  </html>
`;

  return result;
}

export default createGameSource;
