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
	//console.log(agheight, lines, holes, bumpiness);
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
	let init = cloneTetro(tetromino); //deepCopy(tetromino);
	while(true) {
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
	
		if(!tetromino.rotate(arena) || checkValues(init.matrix, tetromino.matrix)) {
			break;
		}
		r++;
	}

	tetromino = init;
	return moves;
};

var makeMove = function(arena, tetromino, move) {

	for(let i = 0; i < move['rotate']; i++) {	
		tetromino.rotate(arena);
	}
	tetromino.push(arena, move['push']);
	
	while(tetromino.drop(arena)) {
		continue;
	}
}

var undoMove = function(arena, tetromino) {
	arena.seperate();
}

var playRandom = function(arena, tetromino) {
	let moves = generateMoves(arena, tetromino);
	let move = moves[Math.floor(Math.random() * moves.length)];
	makeMove(arena, tetromino, move);
}


//soln for generateMoves:
//first rotate the piece
//then for each rotation check how much you can push..
//thank me later!








