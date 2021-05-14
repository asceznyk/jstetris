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
    } else if (type === 'J') {
        return [
            [0, 0, 2],
            [2, 2, 2],
            [0, 0, 0],
        ];
    } else if (type === 'L') {
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

var rotateMatrix = function(tetromino, dir) {
	tetromino.matrix = tetromino.matrix[0].map((_, c) => tetromino.matrix.map((r) => r[c]))
	if(dir > 0) {
		tetromino.matrix = tetromino.matrix.map((r) => r.reverse())
	} else {
		tetromino.matrix = tetromino.matrix.reverse()
	}
}
