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
