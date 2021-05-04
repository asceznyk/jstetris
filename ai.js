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
	console.log(agheight, bumpiness, holes, lines);
}


