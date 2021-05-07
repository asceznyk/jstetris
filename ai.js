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
	let [a, b, c, d] = [-0.510066, 0.760666, -0.35663, -0.184483];
	return a * agheight + b * lines + c * holes + d * bumpiness;	
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

	console.log('move generate..')
	
	let r = 4;
	let init = deepCopy(tetromino);
	while(r > 0) {
		r--;
		if(!tetromino.rotate(arena, r)) {		
			continue;
		}	

		let p = 0;
		while(tetromino.push(arena, p)) {
			moves.push({'push':p, 'rotate':r})
			tetromino.x -= p;
			p++;
		}	

		p = -1;
		while(tetromino.push(arena, p)) {
			moves.push({'push':p, 'rotate':r})
			tetromino.x -= p;
			p--;
		}

		if(checkValues(init.matrix, tetromino.matrix)) {		
			console.log('broke loop @'+r)
			break;
		}	
		tetromino.x = init.x;
		tetromino.matrix = init.matrix;
	}
	
	tetromino.x = init.x;
	tetromino.matrix = init.matrix;
	return moves;
};

var matmoves = [];

var makeMove = function(arena, tetromino, move) {	
	tetromino.rotate(arena, move['rotate']);
	tetromino.push(arena, move['push']);	

	matmoves.push({'move':move, 'matrix':deepCopy(tetromino.matrix)});
	
	while(tetromino.drop(arena)) {
		continue;
	}	
}

var undoMove = function(arena, tetromino) {
	arena.seperate();
	let movemat = matmoves.pop();
	let [move, matrix] = [movemat['move'], movemat['matrix']];
	tetromino.matrix = matrix;
	tetromino.rotate(arena, -move['rotate']);
	tetromino.push(arena, -move['push']);
	tetromino.y = 0;
}

var playRandom = function(arena, tetromino) {
	let moves = generateMoves(arena, tetromino);
	let move = moves[Math.floor(Math.random() * moves.length)];
	makeMove(arena, tetromino, move);
}












