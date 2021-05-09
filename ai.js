const INF = 300000;

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
			break;
		}	
		tetromino.x = init.x;
		tetromino.matrix = init.matrix;
	}
	
	tetromino.x = init.x;
	tetromino.matrix = init.matrix;
	return moves;
};

var makeMove = function(arena, tetromino, move, history) {	
	if(history) {
		history.push(deepCopy(tetromino))
	}
	tetromino.rotate(arena, move['rotate']);
	tetromino.push(arena, move['push']);		
	
	while(tetromino.drop(arena)) {
		continue;
	}	
}

var undoMove = function(arena, tetromino, history) {
	arena.seperate();
	let past = history.pop();	
	tetromino.x = past.x;
	tetromino.matrix = past.matrix;	
}

var playRandom = function(arena, tetromino) {
	let moves = generateMoves(arena, tetromino);
	let move = moves[Math.floor(Math.random() * moves.length)];
	makeMove(arena, tetromino, move);
} 

var dfsMove = function(arena, tetromino, depth) {
	let stack = [];
	let root = {pos: deepCopy(arena.matrix), depth:depth};
	stack.push(root);
	
	let bestn;
	let bestscore = -INF;
	let history = [];

	while(stack.length) {
		let branch = stack.pop();
		
		if(!branch.depth) {
			continue;
		}

		arena.matrix = deepCopy(branch.pos);
		let moves = generateMoves(arena, tetromino);
		let scores = Array(moves.length).fill(0);
		for(let m = 0; m < moves.length; m++) {
			makeMove(arena, tetromino, moves[m], history);
			let leaf = {
				pos: deepCopy(arena.matrix), 
				depth:branch.depth-1, 
				parent:branch, 
				move:moves[m]
			};
			
			scores[m] = arenaScore(arena);
			if(scores[m] > bestscore) {
				bestscore = scores[m];
				bestn = leaf;
			}

			stack.push(leaf);
			undoMove(arena, tetromino, history);
		}
	}

	arena.matrix = deepCopy(root.pos);
	
	let node = bestn;
	while(1) {
		if(node.parent.depth == depth) {
			break;
		}
		node = node.parent;
	}	

	return node.move;
}

var exhaustMoves = function(arena, tetromino) {
	let bestmove;
	let bestscore = -INF;

	let moves = generateMoves(arena, tetromino);
	let scores = Array(moves.length).fill(0);

	let history = [];

	for(let m = 0; m < moves.length; m++) {	
		makeMove(arena, tetromino, moves[m], history);
		console.log(tetromino.future[0]);

		scores[m] = arenaScore(arena);
		if(scores[m] >= bestscore) {	
			bestscore = scores[m];
			bestmove = moves[m];
			//console.log('best move: '+moves[m])
			//console.log('best score: '+bestscore);
		}

		undoMove(arena, tetromino, history);
	}

	return bestmove;
}

var playAI = function(arena, tetromino) {
	let move = dfsMove(arena, tetromino, 2); //exhaustMoves(arena, tetromino); 
	makeMove(arena, tetromino, move);
}



