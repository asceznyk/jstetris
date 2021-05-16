const canvas = document.getElementById('mycanvas');
const ctx = canvas.getContext('2d');

const rows = 22;
const cols = 10;
const scl = canvas.width/cols; 

ctx.scale(scl, scl);

var end = 0;
var fly = 0;

var rpg = new RandomPieceGenerator();
//var pieces = [null, rpg.next()];
var piece = rpg.next();
var arena = new Arena(cols, rows);

var ai = 0;
var start = 0;
var lapse = 50;
var paused = 0;

var stepTetris = function() {
	ctx.fillStyle = "#E0FBFC";
	ctx.fillRect(0, 0, canvas.width, canvas.height);	
	
	arena.show();
	arena.sweep();
	
	let exceeded = arena.exceeded();
	if(exceeded) {
		end = 1;
	} 

	if(!ai) {
		if(!exceeded) {
			fly = piece.drop(arena);
			piece.show();
		}
	} else {
		piece = exhaustMoves(arena, [piece], 0);
		while(piece.drop(arena));
		fly = 0;
	}

	if(!fly) {	
		arena.merge(piece);
		piece = rpg.next();
	}

	document.getElementById('score').innerHTML = 'Score: '+arena.score;
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
