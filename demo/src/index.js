import { ConvertProject, libText } from '../../src/index';
import testProject from '../data/WelcomeDemo.project.json';
import './style.css';

const projectString = ConvertProject.projectToGameScript( testProject );

const gameScript = `
${ libText }
${ projectString }
`;

const script = document.createElement( 'script' );
script.type = 'text/javascript';
script.innerHTML = gameScript;
document.body.appendChild( script );
