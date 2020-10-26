/* eslint-disable */

// import { Engine, Notes } from '../../src/index';
// // import testProject from '../data/WelcomeDemo.project.json';
import testProject from '../data/WelcomeTransfer.json';
import createGameSource from './createGameSource';
import './style.css';

const testScript = `
  while(true) {
    console.log(engine.shouldBreak());
  }
`;

const iframe = document.createElement( 'iframe' );
iframe.id = 'play-iframe';
iframe.srcdoc = createGameSource( testProject, testScript );

const container = document.getElementById( 'main-container' );
container.appendChild( iframe );
