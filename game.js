const canvas = document.getElementById('ingame');
const ctx = canvas.getContext('2d');

const rows = 22;
const cols = 10;
const scl = canvas.width/cols; 

ctx.scale(scl, scl);

let ai = 0;
let start = 0;
let lapse = 50;
let paused = 0;

let end = 0;
let fly = 0;

let rpg = new RandomPieceGenerator();
let pieces = [rpg.next(), rpg.next()];
let piece = pieces[0];
let arena = new Arena(cols, rows);

const stepTetris = function() {
	ctx.fillRect(0, 0, canvas.width, canvas.height);	
	
	arena.show();
	arena.sweep();
	
	let exceeded = arena.exceeded();
	if(exceeded) {
		end = 1;
	} 

	if(ai) {
		piece = rdfsMoves(arena, pieces, 0).piece;
		while(piece.drop(arena));
		fly = 0;
	} else {
		if(!exceeded) {
			fly = piece.drop(arena);
			piece.show();
		}
	}

	if(!fly) {	
		arena.merge(piece);

		for(let i = 0; i < pieces.length - 1; i++) {
			pieces[i] = pieces[i+1]
		}
		pieces[pieces.length-1] = rpg.next();

		piece = pieces[0];
	}

	document.getElementsByClassName('lines')[0].innerHTML = 'Lines: '+arena.score;
};

document.addEventListener('keydown', function(e) {	
	if(e.keyCode == 37) {
		piece.push(arena, -1);
	} else if(e.keyCode == 38) {
		piece.rotate(arena, 1);
	} else if(e.keyCode == 39) {
		piece.push(arena, 1);
	} else if(e.keyCode == 40) {
		piece.drop(arena);
	} else if(e.keyCode == 13) {
		paused ^= 1;	
	} else if(e.keyCode == 82) {
		arena.reset();
	} else if(e.keyCode == 65) {
		ai ^= 1;
	}
});

const showTetris = function(time) {
	if((time-start) >= lapse && !paused) {
		start = time;	
		if(!end) {
			stepTetris();
			game = 0;
		}	
	}	
	window.requestAnimationFrame(showTetris);
} 

let game = window.requestAnimationFrame(showTetris);
