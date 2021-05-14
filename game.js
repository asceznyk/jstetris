const canvas = document.getElementById('mycanvas');
const ctx = canvas.getContext('2d');

const rows = 22;
const cols = 10;
const scl = canvas.width/cols; 

ctx.scale(scl, scl);

var end = 0;

var tetromino = new Tetromino(cols);
var arena = new Arena(cols, rows);

var stepTetris = function() {
	ctx.fillStyle = "#E0FBFC";
	ctx.fillRect(0, 0, canvas.width, canvas.height);	
	tetromino.drop(arena);
	if(!ai) {tetromino.show() };
	arena.sweep();
	arena.show();
	document.getElementById('score').innerHTML = 'Score: '+arena.score;
};

document.addEventListener('keydown', function(e) {	
	if(e.keyCode == 37) {
		tetromino.push(arena, -1);
	} else if(e.keyCode == 38) {
		tetromino.rotate(arena, 1);
	} else if(e.keyCode == 39) {
		tetromino.push(arena, 1);
	} else if(e.keyCode == 40) {
		tetromino.drop(arena);
	} else if(e.keyCode == 13) {
		paused ^= 1;	
	} else if(e.keyCode == 82) {
		arena.reset();
	} else if(e.keyCode == 65) {
		ai ^= 1;
	}
});

var ai = 0;
var start = 0;
var paused = 0;
var showTetris = function(time) {
	if((time-start) >= 100 && !paused) {
		if(!end) {
			start = time;	
			if(ai) {
				tetromino = playAI(arena, tetromino);
				//playAI(arena, tetromino)
			}
			stepTetris();	
		}
	}	
	window.requestAnimationFrame(showTetris);
} 

var game = window.requestAnimationFrame(showTetris);
