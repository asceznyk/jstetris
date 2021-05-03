var	HeightBumpiness = function(arena) {
	let agheight = 0;
	let bumpiness = 0;
	let last = 0;
	for(let j = 0; j < arena.cols; j++) {
		for(let i = 0; i < arena.rows; i++)  {	
			if(arena.matrix[i][j] > 0) {
				let height = arena.rows - i;
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

var arenaScore = function(arena) {
	let [agheight, bumpiness] = HeightBumpiness(arena)
	console.log(agheight, bumpiness);
}


