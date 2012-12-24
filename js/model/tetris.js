(function(exports, $) {

	"use strict";
	
	function TetrominoBase() {
		this.locked = false;
		this.left = 3;
		this.top = 0;
		this.matrixNum = 4;
		this.matrix = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
		this.rotateFlag = false;
	}

	TetrominoBase.prototype.moveLeft = function() {
		if (!this.locked) {
			this.left--;
		}
	};

	TetrominoBase.prototype.moveRight = function() {
		if (!this.locked) {
			this.left++;
		}
	};

	TetrominoBase.prototype.moveUp = function() {
		if (!this.locked) {
			this.top--;
		}
	};		

	TetrominoBase.prototype.moveDown = function() {
		if (!this.locked) {
			this.top++;
		}
	};	

	TetrominoBase.prototype.rotateLeft = function() {
		if (!this.locked) {
			var newMatrix = utils.create2DArray(this.matrixNum, this.matrixNum);
			for (var i = 0; i < this.matrixNum; i++) {
				for (var j = 0; j < this.matrixNum; j++) {
					newMatrix[i][j] = this.matrix[j][this.matrixNum - 1 - i];
				}
			}
			this.matrix = newMatrix;
		}
	};	

	TetrominoBase.prototype.rotateRight = function() {
		if (!this.locked) {
			var newMatrix = utils.create2DArray(this.matrixNum, this.matrixNum);
			for (var i = 0; i < this.matrixNum; i++) {
				for (var j = 0; j < this.matrixNum; j++) {
					newMatrix[j][this.matrixNum - 1 - i] = this.matrix[i][j];
				}
			}
			this.matrix = newMatrix;
		}
	};

	TetrominoBase.prototype.getPoints = function() {
		var pointsArray = [];
		for (var i = 0; i < this.matrixNum; i++) {
			for (var j = 0; j < this.matrixNum; j++) {
				if (this.matrix[i][j]) {
					pointsArray.push({'x' : this.left + i, 'y' : this.top + j});
				}
			}
		}
		return pointsArray;
	};

//////////////////////////////////////////////////////////

	function ITetromino() {
		TetrominoBase.call(this);

		this.left = 2;
		this.top = -3;
		this.matrix[2][0] = 1;
		this.matrix[2][1] = 1;
		this.matrix[2][2] = 1;
		this.matrix[2][3] = 1;
	}

	ITetromino.prototype = new TetrominoBase();
	ITetromino.prototype.constructor = TetrominoBase;

	ITetromino.prototype.rotateLeft = function() {
			if (this.rotateFlag) {
				this.rotateFlag = false;
				TetrominoBase.prototype.rotateRight.call(this);
			} else {
				TetrominoBase.prototype.rotateLeft.call(this);
				this.rotateFlag = true;
			}
	};


//////////////////////////////////////////////////////////

	function STetromino() {
		TetrominoBase.call(this);

		this.top = -2;
		this.matrix[0][2] = 1;
		this.matrix[1][2] = 1;
		this.matrix[1][1] = 1;
		this.matrix[2][1] = 1;
	}

	ITetromino.prototype = new TetrominoBase();
	ITetromino.prototype.constructor = TetrominoBase;

	ITetromino.prototype.rotateLeft = function() {
			if (this.rotateFlag) {
				this.rotateFlag = false;
				TetrominoBase.prototype.rotateRight.call(this);
			} else {
				TetrominoBase.prototype.rotateLeft.call(this);
				this.rotateFlag = true;
			}
	};

//////////////////////////////////////////////////////////

	function OTetromino() {
		TetrominoBase.call(this);

		this.top = -2;
		this.matrix[1][1] = 1;
		this.matrix[1][2] = 1;
		this.matrix[2][1] = 1;
		this.matrix[2][2] = 1;
	}

	OTetromino.prototype = new TetrominoBase();
	OTetromino.prototype.constructor = TetrominoBase;

	OTetromino.prototype.rotateRight = function() {
	};

	OTetromino.prototype.rotateLeft = function() {
	};

//////////////////////////////////////////////////////////

	function TTetromino() {
		TetrominoBase.call(this);

			this.matrixNum = 3;
			this.matrix = [[0, 0, 0],[0, 0, 0],[0, 0, 0]];
			this.top = -2;
			this.matrix[0][1] = 1;
			this.matrix[1][1] = 1;
			this.matrix[1][2] = 1;
			this.matrix[2][1] = 1;
	}

	TTetromino.prototype = new TetrominoBase();
	TTetromino.prototype.constructor = TetrominoBase;

//////////////////////////////////////////////////////////

	function ZTetromino() {
		TetrominoBase.call(this);

		this.top = -2;
		this.matrix[0][1] = 1;
		this.matrix[1][1] = 1;
		this.matrix[1][2] = 1;
		this.matrix[2][2] = 1;
	}

	ZTetromino.prototype = new TetrominoBase();
	ZTetromino.prototype.constructor = TetrominoBase;

	ZTetromino.prototype.rotateLeft = function() {
			if (this.rotateFlag) {
				this.rotateFlag = false;
				TetrominoBase.prototype.rotateRight.call(this);
			} else {
				TetrominoBase.prototype.rotateLeft.call(this);
				this.rotateFlag = true;
			}
	};

//////////////////////////////////////////////////////////

	function LTetromino() {
		TetrominoBase.call(this);

		this.top = -2;
		this.matrix[0][2] = 1;
		this.matrix[1][2] = 1;
		this.matrix[2][2] = 1;
		this.matrix[2][1] = 1;
	}

	LTetromino.prototype = new TetrominoBase();
	LTetromino.prototype.constructor = TetrominoBase;

//////////////////////////////////////////////////////////

	function JTetromino() {
		TetrominoBase.call(this);

		this.top = -2;
		this.matrix[1][1] = 1;
		this.matrix[1][2] = 1;
		this.matrix[2][2] = 1;
		this.matrix[3][2] = 1;
	}

	JTetromino.prototype = new TetrominoBase();
	JTetromino.prototype.constructor = TetrominoBase;

//////////////////////////////////////////////////////////

	exports.Tetris = {
		create : function() {
			var num = Math.floor(Math.random()*7);
			utils.log('create tetromino type no: ' + num);
			switch (num) {
				case 0:
					return new ITetromino();
				break;

				case 1:
					return new OTetromino();
				break;

				case 2:
					return new LTetromino();
				break;

				case 3:
					return new JTetromino();
				break;

				case 4:
					return new STetromino();
				break;

				case 5:
					return new ZTetromino();
				break;

				case 6:
					return new TTetromino();
				break;				

				default : return null;
			}			
		}
	};

})(this, jQuery);