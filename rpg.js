function RandomPieceGenerator(){
    Math.seed
    this.bag = ['O', 'J', 'L', 'Z', 'S', 'T', 'I'];
    this.shuffle();
    this.index = -1;
};

RandomPieceGenerator.prototype.next = function(){
    this.index++;
    if (this.index >= this.bag.length){
        this.shuffle();
        this.index = 0;
    }
    return new Tetromino(createMatrix(this.bag[this.index]));
};

RandomPieceGenerator.prototype.shuffle = function() {
    var curidx = this.bag.length
        , temp
        , randomidx;

    while (0 !== curidx) {

        randomidx = Math.floor(Math.random() * curidx);
        curidx -= 1;

        temp = this.bag[curidx];
        this.bag[curidx] = this.bag[randomidx];
        this.bag[randomidx] = temp;
    }
}
