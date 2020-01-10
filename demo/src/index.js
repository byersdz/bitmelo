/* eslint-disable */

import { Engine, Notes } from '../../src/index';
import testProject from '../data/WelcomeDemo.project.json';
import './style.css';

const engine = new Engine();

engine.addProjectData( testProject );

// Globals
let inp = null; // input
let scr = null; // screen
let aud = null; // audio

const player = {
	x: 90,
	y: 30,
	speed: 0.5,
	isWalking: false,
	flip: 0,
	framesSinceWalkStart: 0
}

const mushrooms = [
	{
		x: 36,
		y: 30,
		wasGrabbed: false
	},
	{
		x: 130,
		y: 70,
		wasGrabbed: false
	}
];

let numberOfGrabbedMushrooms = 0;

let randomColor = 1;

// initialization
engine.onInit = () => {
	inp = engine.input;
	scr = engine.screen;
	aud = engine.audio;

	updateColors();
};


// update loop
engine.onUpdate = () => {
  scr.clear( 1 );

	scr.drawMap(
	  0,      // originX on map
	  0,      // originY on map
	  -1,     // width
	  -1,     // height
	  0,      // screenX
	  0,      // screenY
	  0       // tilemap index
	);

	drawMushrooms();

	updatePlayer();

	let textMainColor = 2;
	if ( numberOfGrabbedMushrooms > 0 ) {
		textMainColor = randomColor;
	}

	let textPositionOffset = 0;
	if ( numberOfGrabbedMushrooms > 1 ) {
		textPositionOffset = Math.sin( engine.realTimeSinceGameStart * 10 ) * 8;
	}

	scr.drawText(
		'Welcome to Bitmelo!',
		50,
		90 + Math.floor( textPositionOffset ),
		textMainColor,
		1,
		0
	);
};

function drawMushrooms() {
	mushrooms.forEach( mushroom => {
		if ( !mushroom.wasGrabbed ) {
			scr.drawTile(
				61,
				mushroom.x - 8, // center on the position
				mushroom.y - 8, // center on the position
				0
			);
		}
	} );
}

function updatePlayer() {
	let newX = player.x;
	let newY = player.y;

	let isWalking = false;
	if ( inp.left.pressed ) {
		newX -= player.speed;
		isWalking = true;
		player.flip = 1;
	}
	else if ( inp.right.pressed ) {
		newX += player.speed;
		isWalking = true;
		player.flip = 0;
	}

	if ( inp.down.pressed ) {
		newY -= player.speed;
		isWalking = true;
	}
	else if ( inp.up.pressed ) {
		newY += player.speed;
		isWalking = true;
	}

	if ( isWalking ) {
		player.framesSinceWalkStart += 1;
	}

	// play or stop audio
	if ( isWalking && !player.isWalking ) {
		// started walking
		player.framesSinceWalkStart = 0;

		let note = Notes.C4;
		if ( numberOfGrabbedMushrooms > 1 ) {
			note = Notes.C2;
		}
		else if ( numberOfGrabbedMushrooms > 0 ) {
			note = Notes.C3;
		}

		aud.playInfiniteSound(
			0,
			note,
			0.5,
			2
		);
	}
	else if ( !isWalking && player.isWalking ) {
		// stopped walking
		aud.stopInfiniteSound( 0 );
	}

	player.isWalking = isWalking;

	// make sure we are not colliding with the fence
	if (
		newX >= 16
		&& newX < scr.width - 16
		&& newY >= 24
		&& newY < scr.height - 16
	) {
		player.x = newX;
		player.y = newY;
	}

	// check mushroom collisions
	for ( let i = 0; i < mushrooms.length; i += 1 ) {
		const mushroom = mushrooms[i];
		if ( !mushroom.wasGrabbed ) {
			const deltaX = Math.abs( player.x - mushroom.x );
			const deltaY= Math.abs( player.y - mushroom.y );
			const distance = Math.sqrt( deltaX * deltaX + deltaY * deltaY );

			// player has grabbed a mushroom
			if ( distance <= 12 ) {
				mushroom.wasGrabbed = true;
				numberOfGrabbedMushrooms += 1;

				aud.playSound(
					1,
					Notes.E3,
					48,
					0.25,
					1
				);
			}
		}
	}

	// draw the player
	let frameGID = 1;
	if ( player.isWalking ) {
		if ( player.framesSinceWalkStart % 16 < 8 ) {
			frameGID = 2;
		}
		else {
			frameGID = 3;
		}
	}

	scr.drawTile(
		frameGID,
		Math.floor( player.x ) - 8, // center the tile on the position
		Math.floor( player.y ) - 8, // center the tile on the position
		player.flip
	);
}

function updateColors() {
	randomColor = Math.floor( Math.random() * 16 ) + 1;
	setTimeout( updateColors, 100 );
}


engine.begin();
