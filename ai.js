const INF = 300000;

var visited = 0;

var colHeight = function(arena, colidx) {
	let r = 0;
	for(; r < arena.rows && arena.matrix[r][colidx] == 0; r++);
	return arena.rows - r;
}

var	aggHeight = function(arena) {
	let agheight = 0;	
	for(let c = 0; c < arena.cols; c++) {
		agheight += colHeight(arena, c);
	}
	return agheight;
}

var bumpiness = function(arena) {
	let total = 0;
	for(let c = 0; c < arena.cols - 1; c++) {
		total += Math.abs(colHeight(arena, c) - colHeight(arena, c+1));
	}
	return total;
}

var completeLines = function(arena) {
	let total = 0;

	let r = arena.rows;
	outer: while(r) {
		r--;
		for(let c = 0; c < arena.cols; c++) {
			if(arena.matrix[r][c] == 0) {	
				continue outer;
			}
		}
		total++;
	}	
	return total;
}

var countHoles = function(arena) {
	let count = 0;
	for(let c = 0; c < arena.cols; c++) {
		let block = false;
		for(let r = 0; r < arena.rows; r++) {
			if(arena.matrix[r][c] != 0) {
				block = true;
			}	else if(arena.matrix[r][c] == 0 && block) {
				count++;
			}
		}
	}

	return count;
}

var arenaScore = function(arena) {
	let agheight = aggHeight(arena);
	let lines = completeLines(arena);
	let holes = countHoles(arena);
	let bumps = bumpiness(arena);
	let [a, b, c, d] = [0.510066, 0.760666, 0.35663, 0.184483];
	let score = -a * agheight + b * lines - c * holes - d * bumps
	if(score != 0) {
		return score;
	}
	return -INF;
}

var rdfsMoves = function(arena, pieces, idx){
	let bestpiece = null;
	let bestscore = null;

	let piece = pieces[idx];

	for(let rotation = 0; rotation < 4; rotation++){
		let _piece = piece.copy();
		for(let i = 0; i < rotation; i++){
			_piece.rotate(arena);
		}
		while(_piece.push(arena, -1));

		while (!collideMatrix(_piece, arena)) {
			let ppiece = _piece.copy();	
			while(ppiece.drop(arena));

			let _arena = arena.copy();		
			_arena.merge(ppiece);

			let score = null;
			if(idx == pieces.length-1) {
				score = arenaScore(_arena);
			} else {
				score = rdfsMoves(_arena, pieces, idx+1).score
			}

			//let score = arenaScore(_arena);

			visited++;

			if (score > bestscore || bestscore == null){
				bestscore = score; 
				bestpiece = _piece.copy();	
			}

			_piece.x++;
		}
	}
		
	return {piece:bestpiece, score:bestscore};
};

