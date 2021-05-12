var rdfsMove = function(_arena, _tetromino, depth) {
	let bestmove;
	let bestscore = null;

	let moves = generateMoves(_arena, _tetromino);

	let history = [];

	for(let m = 0; m < moves.length; m++) {	
		makeMove(_arena, _tetromino, moves[m], history);

		let score = null;
		if(depth) {
			score = rdfsMove(_arena, _tetromino, depth-1).score;
		} else {
			score = arenaScore(_arena);
		}

		visited++;
			
		if(score > bestscore || bestscore == null) {	
			bestscore = score;
			bestmove = moves[m];
			//console.log('best move: '+ JSON.stringify(moves[m]) + ' best score: '+ bestscore + ' depth: ' + depth);
			//console.log(_arena.matrix);
		}

		undoMove(_arena, _tetromino, history);
	}

	//console.log('best score:'+bestscore + ' bestmove:'+JSON.stringify(bestmove) + ' depth: '+depth);

	return {move:bestmove, score:bestscore};
}

var idfsMove = function(arena, tetromino, depth) {
	let stack = [];
	let root = {pos: deepCopy(arena.matrix), depth:depth};
	stack.push(root);	
	
	let bestn;	
	let history = [];
	let bestscore = -INF;

	while(stack.length) {
		let branch = stack.pop();
		
		if(!branch.depth) {
			continue;
		}
		
		arena.matrix = deepCopy(branch.pos);
		let moves = generateMoves(arena, tetromino);		

		for(let m = 0; m < moves.length; m++) {
			makeMove(arena, tetromino, moves[m], history);
			let leaf = {
				pos: deepCopy(arena.matrix), 
				depth:branch.depth-1, 
				parent:branch, 
				move:moves[m]
			};

			visited++;
			
			let score = leaf.depth == 0 ? arenaScore(arena) : -INF;
			if(score > bestscore) {
				bestscore = score;
				bestn = leaf;
				//console.log('best move: '+ JSON.stringify(moves[m]) + ' best score: '+ bestscore + ' depth: ' + leaf.depth);		
			}	

			stack.push(leaf);
			undoMove(arena, tetromino, history);
		}
	}

	arena.matrix = deepCopy(root.pos);
	
	let node = bestn;	
	while(node.parent.depth !== depth) {	
		node = node.parent;
	}	

	return node.move;
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

	for(let r = 0; r < 4; r++) {
		for(let i = 0; i < r; i++) {
			tetromino.rotate(arena);
		}
		while(tetromino.left(arena));
	
		let p = 0;	
		while(tetromino.push(arena, 1)) {
			moves.push({'push':p, 'rotate':r});	
			p++;
		}	

		tetromino.matrix = init;
	}
	
	tetromino.x = 0;
	tetromino.matrix = init;
	return moves;
};

var makeMove = function(arena, tetromino, move, history) {	
	if(history) {
		history.push(deepCopy(tetromino))
	}
	
	for(let r = 0; r < move['rotate']; r++) {
		tetromino.rotate(arena);
	}
	
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

var exhaustMoves = function(arena, tetromino) {
	let bestmove = null;
	let bestscore = -INF;

	let moves = generateMoves(arena, tetromino);	

	let history = [];

	for(let m = 0; m < moves.length; m++) {	
		makeMove(arena, tetromino, moves[m], history);
		
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


