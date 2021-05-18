const canvas = document.getElementById('mycanvas');
const ctx = canvas.getContext('2d');

const rows = 22;
const cols = 10;
const scl = canvas.width/cols; 

ctx.scale(scl, scl);

var ai = 0;
var start = 0;
var lapse = 50;
var paused = 0;

var end = 0;
var fly = 0;

var rpg = new RandomPieceGenerator();
var pieces = [rpg.next(), rpg.next()];
var piece = pieces[0];
var arena = new Arena(cols, rows);

var stepTetris = function() {
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
		console.log('nodes visited:'+visited);
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

var showTetris = function(time) {
	if((time-start) >= lapse && !paused) {
		start = time;	
		if(!end) {
			stepTetris();
			game = 0;
		}	
	}	
	window.requestAnimationFrame(showTetris);
} 

var game = window.requestAnimationFrame(showTetris);
