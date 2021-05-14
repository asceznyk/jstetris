var colors = ['', '#BCDEEB', '#3D5A80', '#98C1D9', '#EE6C4D', '#8C4F47', '#293241', '#5B4144']; 

class Tetromino {
	constructor(cols) {
		this.start = Math.floor(cols/2);
		this.x = this.start;
		this.y = 0;
		this.rpg = new RandomPieceGenerator();
		
		this.future = [this.rpg.next(), this.rpg.next()];
		this.matrix = this.future[0];
	}

	reset(arena) {
		this.x = this.start;
		this.y = 0;	
		
		this.future.push(this.rpg.next());
		this.future.shift();
		this.matrix = this.future[0];
	
		if(collideMatrix(this, arena)) {
			console.log('ended here!');
			console.log(arena.matrix);
			console.log(tetromino);
			arena.reset();	
			end = 1;
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

	left(arena) {
		this.x -= 1;
		if(collideMatrix(this, arena)) {
			this.x += 1;
			return 0;
		}
		return 1;
	}

	rotate(arena) {
		let pos = this.x;
		let offset = 1;
		rotateMatrix(this, 1);
		while (collideMatrix(this, arena)) {
			this.x += offset;
			offset = -(offset + (offset > 0 ? 1 : -1));
			if (offset > this.matrix[0].length) {
				rotateMatrix(this, -1);
				this.x = pos;
				return;
			}
		}

		/*let dir = 1;
		rotateMatrix(this, dir);
		if (collideMatrix(this, arena)) {
			rotateMatrix(this, -dir);
		}*/
	}	

	copy() {
		let copy = new Tetromino(10);
		copy.matrix = deepCopy(this.matrix)
		copy.x = this.x
		return copy;
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
					if(
						this.matrix[tetromino.y+y] && this.matrix[tetromino.y+y][tetromino.x+x]
					) {
						let cell = this.matrix[tetromino.y+y][tetromino.x+x]
						if(tetromino.matrix[y][x] === cell) {	
							this.matrix[tetromino.y+y][tetromino.x+x] = 0;
						} 
					}
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
		copy.matrix = deepCopy(this.matrix);
		copy.future = deepCopy(this.future);
		copy.history = deepCopy(this.history);
		copy.score = this.score;
		return copy;
	}

	show() {
		for(let r = 0; r < this.rows; r++) {
			for(let c = 0; c < this.cols; c++) {
				if(r < 2) {
					ctx.fillStyle = '#fff';
					ctx.fillRect(c, r, 1, 1);
				} else {
					if(this.matrix[r][c]) {
						ctx.fillStyle = colors[this.matrix[r][c]];
						ctx.fillRect(c, r, 1, 1);
					}
				}
			}
		}
	}
}


