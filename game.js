var tetromino = new Tetromino(cols);
var arena = new Arena(cols, rows);

var stepTetris = function() {
	ctx.fillStyle = "#E0FBFC";
	ctx.fillRect(0, 0, canvas.width, canvas.height);	
	tetromino.drop(arena);
	tetromino.show();	
};

document.addEventListener('keydown', function(e) {
	if(e.keyCode == 37) {
		tetromino.move(arena, -1);
	} else if(e.keyCode == 38) {
		tetromino.rotate(arena);
	} else if(e.keyCode == 39) {
		tetromino.move(arena, 1);
	} else if(e.keyCode == 40) {
		tetromino.drop(arena);
	} else if(e.keyCode == 80) {
		window.cancelAnimationFrame(game);
	}
});

var start = 0;
var showTetris = function(time) {
	if((time-start) >= 200) {
		start = time;
		stepTetris();
		arena.sweep();
		arena.show();
		arenaScore(arena);
	}	
	window.requestAnimationFrame(showTetris);
} 

let game = window.requestAnimationFrame(showTetris);
