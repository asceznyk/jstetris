var tetromino = new Tetromino(cols);
var arena = new Arena(cols, rows);

var stepTetris = function() {
	ctx.fillStyle = "#E0FBFC";
	ctx.fillRect(0, 0, canvas.width, canvas.height);	
	tetromino.drop(arena);
	tetromino.show();	
};

document.addEventListener('keydown', function(e) {
	ai = 0;
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
		ai = 1;
	}
});

var ai = 0;
var start = 0;
var paused = 0;
var showTetris = function(time) {
	if((time-start) >= 200 && !paused) {
		start = time;
		stepTetris();
		arenaScore(arena);
		if(ai) {
			playRandom(arena, tetromino);
		}
		arena.sweep();
		arena.show();	
	}	
	window.requestAnimationFrame(showTetris);
} 

var game = window.requestAnimationFrame(showTetris);
