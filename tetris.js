const canvas = document.getElementById('mycanvas');
const ctx = canvas.getContext('2d');

const rows = 20;
const cols = 10;
const scl = canvas.width/cols; 

ctx.scale(scl, scl);

var colors = ['', '#BCDEEB', '#3D5A80', '#98C1D9', '#EE6C4D', '#8C4F47', '#293241', '#5B4144']; 

var createMatrix = function() {
	let text = 'IJZOSLT';
	let type = text[Math.floor(Math.random() * text.length)];
	if (type === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (type === 'L') {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [0, 2, 2],
        ];
    } else if (type === 'J') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0],
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

class Tetromino {
	constructor(cols) {
		this.start = Math.floor(cols/2);
		this.x = this.start;
		this.y = 0;
		this.matrix = createMatrix();	
	}

	reset(arena) {
		this.x = this.start;
		this.y = 0;
		this.matrix = createMatrix();
	
		if(collideMatrix(this, arena)) {
			arena.reset();
		}
	}

	drop(arena) {
		this.y++;
		if(collideMatrix(this, arena)) {
			this.y--;
			arena.merge(this);
			this.reset(arena);
			return 0;
		}
		return 1;
	}

	push(arena, dir) {
		this.x += dir;
		if(collideMatrix(this, arena)) {
			this.x -= dir;
			return 0;
		}
		return 1;
	}

	rotate(arena, dir) {
		if(dir !== 0) {
			rotateMatrix(this, dir);
			if (collideMatrix(this, arena)) {
				rotateMatrix(this, -dir);
				return 0;
			} 
		}
		return 1;
	}

	show() {
		for (let y = 0; y < this.matrix.length; y++) {
			for (let x = 0; x < this.matrix.length; x++) {
				if (this.matrix[y][x]) {
					ctx.fillStyle = colors[this.matrix[y][x]];
					ctx.fillRect(this.x+x, this.y+y, 1, 1);	
				}
			}
		}
	}
}

class Arena {
	constructor(cols, rows) {
		this.cols = cols;
		this.rows = rows;

		this.record = [];

		this.matrix = [];
		for(let r = 0; r < rows; r++) {
			this.matrix[r] = new Array(this.cols).fill(0);
		}
	}

	reset() {
		this.matrix = [];
		for(let r = 0; r < rows; r++) {
			this.matrix[r] = new Array(this.cols).fill(0);
		}

		this.record = [];
	}

	merge(tetromino) {
		for(let y = 0; y < tetromino.matrix.length; y++) {
			for(let x = 0;  x < tetromino.matrix.length; x++) {
				if(tetromino.matrix[y][x] !== 0) {	
					this.matrix[tetromino.y+y][tetromino.x+x] = tetromino.matrix[y][x];
				}
			}
		}
		
		let data = deepCopy(tetromino);
		this.record.push(data);
	}

	seperate() {
		if(this.record.length) {
			let tetromino = this.record.pop();

			for(let y = 0; y < tetromino.matrix.length; y++) {
				for(let x = 0;  x < tetromino.matrix.length; x++) {
					let cell = this.matrix[tetromino.y+y][tetromino.x+x]
					if(tetromino.matrix[y][x] === cell) {	
						this.matrix[tetromino.y+y][tetromino.x+x] = 0;
					}
				}
			}
		}
	}

	show() {
		for(let r = 0; r < this.rows; r++) {
			for(let c = 0; c < this.cols; c++) {
				if(this.matrix[r][c]) {
					ctx.fillStyle = colors[this.matrix[r][c]];
					ctx.fillRect(c, r, 1, 1);
				}
			}
		}
	}

	sweep() {
		let r = this.rows-1;
		outer: while(r) {
			for(let c = 0; c < this.cols; c++) {
				if (this.matrix[r][c] === 0) {
					r--;
					continue outer;
				}
			}			
			this.matrix.splice(r, 1);
			this.matrix.unshift(new Array(this.cols).fill(0));
		}
	}
}


