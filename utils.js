const deepCopy = (objectin) => {
  let outobject, value, key

  if (typeof objectin !== "object" || objectin === null) {
    return objectin // Return the value if objectin is not an object
  }

  // Create an array or object to hold the values
  outobject = Array.isArray(objectin) ? [] : {}

  for (key in objectin) {
    value = objectin[key]

    // Recursively (deep) copy for nested objects, including arrays
    outobject[key] = deepCopy(value)
  }

  return outobject
}

var createMatrix = function(text) {
	let type = text[Math.floor(Math.random() * text.length)];
	if (type === 'I') {
        return [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
        ];
    } else if (type === 'L') {
        return [
            [0, 0, 2],
            [2, 2, 2],
            [0, 0, 0],
        ];
    } else if (type === 'J') {
        return [
            [3, 0, 0],
            [3, 3, 3],
            [0, 0, 0],
        ];
    } else if (type === 'O') {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === 'Z') {
        return [
            [5, 5, 0],
            [0, 5, 5],
            [0, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    } else if (type === 'T') {
        return [
            [0, 7, 0],
            [7, 7, 7],
            [0, 0, 0],
        ];
    }
};

var collideMatrix = function(tetromino, arena) {
	let [m, o] = [tetromino.matrix, {x: tetromino.x, y: tetromino.y}];
	for(let y = 0; y < m.length; y++) {
		for(let x = 0; x < m.length; x++) {	
			if ((m[y][x] !== 0 && !arena.matrix[o.y+y])
				|| (m[y][x] !== 0 && arena.matrix[o.y+y][o.x+x] !== 0)) {
				return true;
			}
		}
	}

	return false;
}

/*var rotateMatrix = function(tetromino, dir) {
	//tetromino.matrix = tetromino.matrix[0].map((_, c) => tetromino.matrix.map((r) => r[c]))
	
	for (let y=0; y < tetromino.matrix.length; ++y) {
		for (let x = 0; x < y; ++x) {
			[
				tetromino.matrix[x][y], 
				tetromino.matrix[y][x]
			] = [
				tetromino.matrix[y][x], 
				tetromino.matrix[x][y]
			]; 
		}
	}

	if(dir > 0) {
		tetromino.matrix.forEach((r) => r.reverse())
	} else {
		tetromino.matrix.reverse()
	}
}*/

var rotateMatrix = function(tetromino) {
	let m = tetromino.matrix;
	var _cells = new Array(m.length);
	for (var r = 0; r < m.length; r++) {
			_cells[r] = new Array(m.length);
	}

	switch (m.length) { // Assumed square matrix
			case 2:
					_cells[0][0] = m[1][0];
					_cells[0][1] = m[0][0];
					_cells[1][0] = m[1][1];
					_cells[1][1] = m[0][1];
					break;
			case 3:
					_cells[0][0] = m[2][0];
					_cells[0][1] = m[1][0];
					_cells[0][2] = m[0][0];
					_cells[1][0] = m[2][1];
					_cells[1][1] = m[1][1];
					_cells[1][2] = m[0][1];
					_cells[2][0] = m[2][2];
					_cells[2][1] = m[1][2];
					_cells[2][2] = m[0][2];
					break;
			case 4:
					_cells[0][0] = m[3][0];
					_cells[0][1] = m[2][0];
					_cells[0][2] = m[1][0];
					_cells[0][3] = m[0][0];
					_cells[1][3] = m[0][1];
					_cells[2][3] = m[0][2];
					_cells[3][3] = m[0][3];
					_cells[3][2] = m[1][3];
					_cells[3][1] = m[2][3];
					_cells[3][0] = m[3][3];
					_cells[2][0] = m[3][2];
					_cells[1][0] = m[3][1];
					_cells[1][1] = m[2][1];
					_cells[1][2] = m[1][1];
					_cells[2][2] = m[1][2];
					_cells[2][1] = m[2][2];
					break;
	}

	tetromino.matrix = _cells;
};

