const INF = 300000;

const colHeight = function(arena, colidx) {
	let r = 0;
	for(; r < arena.rows && arena.matrix[r][colidx] == 0; r++);
	return arena.rows - r;
}

const aggHeight = function(arena) {
	let agheight = 0;	
	for(let c = 0; c < arena.cols; c++) {
		agheight += colHeight(arena, c);
	}
	return agheight;
}

let bumpiness = function(arena) {
	let total = 0;
	for(let c = 0; c < arena.cols - 1; c++) {
		total += Math.abs(colHeight(arena, c) - colHeight(arena, c+1));
	}
	return total;
}

const completeLines = function(arena) {
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

const countHoles = function(arena) {
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

const arenaScore = function(arena) {
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

const rdfsMoves = function(arena, pieces, idx){
	let bestpiece = null;
	let bestscore = null;

	let piece = pieces[idx];

	for(let rotation = 0; rotation < 4; rotation++){
		let gamePiece = piece.copy();
		for(let i = 0; i < rotation; i++){
			gamePiece.rotate(arena);
		}
		while(gamePiece.push(arena, -1));

		while (!collideMatrix(gamePiece, arena)) {
			let ppiece = gamePiece.copy();	
			while(ppiece.drop(arena));

			let gameArena = arena.copy();		
			gameArena.merge(ppiece);

			let score = null;
			if(idx == pieces.length-1) {
				score = arenaScore(gameArena);
			} else {
				score = rdfsMoves(gameArena, pieces, idx+1).score
			}	

			if (score > bestscore || bestscore == null) {
				bestscore = score; 
				bestpiece = gamePiece.copy();	
			}

			gamePiece.x++;
		}
	}
		
	return {piece:bestpiece, score:bestscore};
};

