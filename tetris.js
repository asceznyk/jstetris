var colors = ['', '#BCDEEB', '#3D5A80', '#98C1D9', '#EE6C4D', '#8C4F47', '#293241', '#5B4144']; 

class Tetromino {
	constructor(matrix) {
		this.matrix = matrix;

		this.x = Math.floor(cols/2) - 1;
		this.y = 0;	
	}

	drop(arena) {
		this.y++;
		if(collideMatrix(this, arena)) {
			this.y--;
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

	rotate(arena) {	
		rotateMatrix(this, 1);
		if(collideMatrix(this, arena)) {	
			rotateMatrix(this, -1)
		}
	}	

	copy() {
		let _matrix = new Array(this.matrix.length);
		for(let r = 0; r < this.matrix.length; r++) {
			_matrix[r] = new Array(this.matrix.length);
			for(let c = 0; c < this.matrix.length; c++) {
				_matrix[r][c] = this.matrix[r][c]
			}
		}
		
		let copy = new Tetromino(_matrix);	
		copy.x = this.x;
		copy.y = this.y;
		return copy;
	}

	show() {
		for (let y = 0; y < this.matrix.length; y++) {
			for (let x = 0; x < this.matrix.length; x++) {
				if (this.matrix[y][x]) {
					ctx.fillStyle = colors[this.matrix[y][x]];
					ctx.fillRect(this.x+x, this.y+y - 2, 1, 1);	
				}
			}
		}
	}
}

class Arena {
	constructor(cols, rows) {
		this.cols = cols;
		this.rows = rows;

		this.score = 0;

		this.matrix = [];
		for(let r = 0; r < rows; r++) {
			this.matrix[r] = new Array(this.cols).fill(0);
		}
	}

	reset() {	
		this.score = 0;
		this.matrix = [];
		for(let r = 0; r < rows; r++) {
			this.matrix[r] = new Array(this.cols).fill(0);
		}	
	}

	merge(tetromino) {
		for(let y = 0; y < tetromino.matrix.length; y++) {
			for(let x = 0;  x < tetromino.matrix.length; x++) {
				if(tetromino.matrix[y][x] !== 0) {	
					this.matrix[tetromino.y+y][tetromino.x+x] = tetromino.matrix[y][x];
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
			this.score++;
			this.matrix.splice(r, 1);
			this.matrix.unshift(new Array(this.cols).fill(0));
		}
	}

	copy() {
		let copy = new Arena(this.cols, this.rows);
		for(let r = 0; r < this.rows; r++) {		
			for(let c = 0; c < this.cols; c++) {
				copy.matrix[r][c] = this.matrix[r][c]
			}
		}	
		copy.score = this.score;
		return copy;
	}

	empty(row) {
		for(let c = 0; c < this.cols; c++) {
			if(this.matrix[row][c] !== 0) {
				return 0;
			}
		}

		return 1;
	}

	exceeded() {
		return !this.empty(0) || !this.empty(1);
	}

	valid(tetromino){
		for(let r = 0; r < tetromino.matrix.length; r++){
			for(let c = 0; c < tetromino.matrix[r].length; c++){
				let _r = tetromino.y + r;
				let _c = tetromino.x + c;
				if (tetromino.matrix[r][c] != 0){
					if(_r < 0 || _r >= this.rows){	
						return false;
					}
					if(_c < 0 || _c >= this.cols){	
						return false;
					}
					if (this.matrix[_r][_c] != 0){
						return false;
					}
				}
			}
		}
    return true;
	};

	show() {
		for(let r = 2; r < this.rows; r++) {
			for(let c = 0; c < this.cols; c++) {
				if(this.matrix[r][c]) {
					ctx.fillStyle = colors[this.matrix[r][c]];
					ctx.fillRect(c, r-2, 1, 1);
				} else {
					ctx.fillStyle = '#E0FBFC';
					ctx.fillRect(c, r-2, 1, 1);
				}
			}
		}
	}
}


