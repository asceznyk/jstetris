const INF = 300000;

var visited = 0;

var	heightBumpiness = function(arena) {
	let agheight = 0;
	let bumpiness = 0;	

	let last = 0;
	for(let c = 0; c < arena.cols; c++) {
		for(let r = 0; r < arena.rows; r++)  {	
			if(arena.matrix[r][c] > 0) {
				let height = arena.rows - r;
				agheight += height;
				
				if(last) {
					bumpiness += Math.abs(last - height);
				}
				last = height;

				break;
			}
		}
	}
	return [agheight, bumpiness];
}

var completeLines = function(arena) {
	let lines = 0;

	let r = arena.rows;
	outer: while(r) {
		r--;
		for(let c = 0; c < arena.cols; c++) {
			if(!arena.matrix[r][c]) {	
				continue outer;
			}
		}
		lines++;
	}	
	return lines;
}

var countHoles = function(arena) {
	let holes = 0;
	for(let c = 0; c < arena.cols; c++) {
		for(let r = 0; r < arena.rows; r++) {
			if(arena.matrix[r][c] > 0) {
				if(arena.matrix[r+1] && arena.matrix[r+1][c] == 0) {
					holes++;	
				}		
			}
		}
	}

	return holes;
}

var arenaScore = function(arena) {
	let [agheight, bumpiness] = heightBumpiness(arena);
	let lines = completeLines(arena);
	let holes = countHoles(arena);
	let [a, b, c, d] = [0.510066, 0.760666, 0.35663, 0.184483];	
	let score = (- a * agheight + b * lines - c * holes - d * bumpiness);
	if(score != 0) {
		return score;
	} else {
		return -INF;
	}
}

var checkValues = function(mtx1, mtx2) {
	for(let r = 0; r < mtx1.length; r++) {
		for(let c = 0; c < mtx1[r].length; c++) {
			if(mtx1[r][c] !== mtx2[r][c]) {
				return false;
			}
		}
	}

	return true;
}

var generateMoves = function(arena, tetromino) {
	let moves = [];
	let r = 0;	
	let init = deepCopy(tetromino.matrix);

	while(r < 4) {
		tetromino.x = 0;
		tetromino.rotate(arena, r);
		while(tetromino.left(arena));
	
		let p = 0;	
		while(tetromino.push(arena, p)) {
			moves.push({'push':p, 'rotate':r});
			while(tetromino.left(arena));
			p++;
		}	

		if(r && checkValues(init, tetromino.matrix)) {		
			break;
		}

		tetromino.matrix = init;

		r++;	
	}
	
	tetromino.x = 0;
	tetromino.matrix = init;
	return moves;
};

var makeMove = function(arena, tetromino, move, history) {	
	if(history) {
		history.push(deepCopy(tetromino))
	}
	tetromino.rotate(arena, move['rotate']);
	tetromino.push(arena, move['push']);		
	
	while(tetromino.drop(arena));
}

var undoMove = function(arena, tetromino, history) {
	arena.seperate();
	let past = history.pop();	
	tetromino.x = past.x;
	tetromino.future.pop();
	tetromino.future.unshift(past.matrix);
	tetromino.matrix = tetromino.future[0];
}

var playRandom = function(arena, tetromino) {
	let moves = generateMoves(arena, tetromino);
	let move = moves[Math.floor(Math.random() * moves.length)];
	makeMove(arena, tetromino, move);
} 

var exhaustMoves = function(arena, tetromino) {
	let bestmove;
	let bestscore = -INF;

	let moves = generateMoves(arena, tetromino);

	let history = [];

	for(let m = 0; m < moves.length; m++) {	
		makeMove(arena, tetromino, moves[m], history);
		
		//console.log('looping..')
		visited++;

		let score = arenaScore(arena);
		if(score > bestscore) {	
			bestscore = score;
			bestmove = moves[m];
			console.log('best move:'+ JSON.stringify(moves[m]));
		}

		undoMove(arena, tetromino, history);
	}

	return bestmove;
}

var playAI = function(arena, tetromino) {
	let move =  exhaustMoves(arena, tetromino); 
	console.log('yay '+JSON.stringify(move));
	console.log('nodes visited: '+visited);
	visited = 0;
	makeMove(arena, tetromino, move);
}



