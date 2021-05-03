var aggHeight = function(arena) {
	let agheight = 0;
	for(let j = 0; j < arena.cols; j++) {
		for(let i = 0; i < arena.rows; i++)  {	
			if(arena.matrix[i][j] > 0) {
				agheight += arena.rows - i;
				break;
			}
		}
	}
	return agheight;
}

var bumpiness = function(arena) {
	let bumpiness = 0;

};

var arenaScore = function(arena) {
	let agheight = aggHeight(arena)
	let bumpiness = bumpiness(arena)
	console.log(agheight);
}


