(function(exports) {
  'use strict';

  /*
   * Grid constructor
   */
  function Grid(id, inputHandler) {
    console.log('Grid constructor');

    this.inputHandler = inputHandler;
    this.eventHandler = null;
    this.eventContext = null;
    this.canvasId = id;
    this.cols = 10;
    this.rows = 15;
    this.gridWidth = 300;
    this.gridHeight = 450;
    this.gridPadding = 5;
    this.cellWidth = 30;
    this.paused = false;
    this.speed = 2;
    this.gameResult = false;
    this.forceStopFlag = false;

    this.colorMap = {
      0: '',
      1: '',
      2: 'aqua',
      3: 'green',
      4: 'gold',
      5: 'indigo',
      6: 'red',
      7: 'blue',
      8: 'darkorange'
    };

    this.gameOver = false;
    this.tetrominoNew = true;
    this.score = 0;
    this.matrix = Util.create2DArray(this.cols, this.rows);
    this.canvas = document.getElementById(this.canvasId);
    this.context = this.canvas && this.canvas.getContext('2d');

    this.cleanGrid();
    this.inputHandler.setReceiver(this.handleInput, this);
  }

  /*
   * Clean grid
   */
  Grid.prototype.cleanGrid = function() {
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (var x = 0; x <= this.gridWidth; x += this.cellWidth) {
      this.context.moveTo(0.5 + x + this.gridPadding, this.gridPadding);
      this.context.lineTo(0.5 +x + this.gridPadding, this.gridHeight + this.gridPadding);
    }

    for (var y = 0; y <= this.gridHeight; y += this.cellWidth) {
      this.context.moveTo(this.gridPadding, 0.5 + y + this.gridPadding);
      this.context.lineTo(this.gridWidth + this.gridPadding, 0.5 + y + this.gridPadding);
    }

    this.context.strokeStyle = 'black';
    this.context.stroke();
  };

  Grid.prototype.setQuiet = function(quiet) {
    this.quiet = !!quiet;
  };

  Grid.prototype.forceStop = function(result) {
    this.gameOver = true;
    this.gameResult = !!result;
    this.forceStopFlag = true;
  };

  Grid.prototype.cleanFilledRows = function() {
    var fullRows = [];
    var i, j, m, n;
    for (i = 0; i < this.rows; i++) {
      var fullRow = true;
      for (j = 0; j < this.cols; j++) {
        if (!this.matrix[j][i]) {
          fullRow = false;
        }
      }

      if (fullRow) {
        this.score += 10;
        fullRows.push(i);

        // score event
        if (this.eventHandler) {
          var eventData = {
            type: 'score',
            data: {
              score: this.score,
              id: this.canvasId,
              win: this.gameResult,
              forceStop: this.forceStopFlag
            }
          };
          this.eventHandler.apply(this.eventContext, [eventData]);
        }
      }
    }

    for (i = 0, j = this.matrix.length; i < j; i++) {
      var column = this.matrix[i];
      for (m = 0, n = fullRows.length; m < n; m++) {
        var index = fullRows[m];
        column.splice(index, 1);
        column.unshift(0);
      }
    }
  };

  Grid.prototype.hideTetromino = function() {
    if (this.tetromino) {
      var tetrominoPoints = this.tetromino.getPoints();
      for (var i = 0, max = tetrominoPoints.length; i < max; i++) {
        this.matrix[tetrominoPoints[i].x][tetrominoPoints[i].y] = 0;
      }
    }
  };

  Grid.prototype.showTetromino = function() {
    if (this.tetromino) {
      var tetrominoPoints = this.tetromino.getPoints();
      var colorCode = this.tetromino.getColor() || 1;
      for (var i = 0, max = tetrominoPoints.length; i < max; i++) {
        var newX = tetrominoPoints[i].x;
        var newY = tetrominoPoints[i].y;
        if (newX >= 0 && newY >= 0) {
          this.matrix[newX][newY] = colorCode;
        }
      }
    }
  };

  Grid.prototype.checkValid = function() {
    var tetrominoPoints = this.tetromino.getPoints();
    for (var i = 0, max = tetrominoPoints.length; i < max; i++) {
      if ((tetrominoPoints[i].x === this.cols) || (tetrominoPoints[i].x === -1)) {
        return false;
      }

      if (this.matrix[tetrominoPoints[i].x][tetrominoPoints[i].y]) {
        return false;
      }

      if (tetrominoPoints[i].y >= this.rows) {
        return false;
      }
    }
    return true;
  };

  Grid.prototype.checkGameOver = function() {
    var tetrominoPoints = this.tetromino.getPoints();
    for (var i = 0, max = tetrominoPoints.length; i < max; i++) {
      if (tetrominoPoints[i].y <= 0 ) {
        this.gameOver = true;
        console.log('Game over! Your score: ' + this.score);
        return true;
      }
    }
    return false;
  };

  Grid.prototype.checkNewTetromino = function() {
    if(this.tetrominoNew) {
      this.cleanFilledRows();
      this.tetromino = this.getTetromino();
    }
  };

  Grid.prototype.render = function() {
    this.cleanGrid();

    var x, y, point, color;
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        point = this.matrix[i][j];
        color = this.colorMap[point];
        if (point && color) {
          this.context.fillStyle = color;
          x = 0.5 + i*this.cellWidth + this.gridPadding;
          y = 0.5 + j*this.cellWidth + this.gridPadding;
          this.context.fillRect(x, y + 1, this.cellWidth - 1, this.cellWidth - 1);
        }
      }
    }
  };

  Grid.prototype.run = function() {
    if (this.tetromino) {
      if (!this.tetrominoNew) {
        this.hideTetromino();
        this.tetromino.moveDown();
        if (!this.checkValid()) {
          this.tetromino.moveUp();

          this.tetromino.moveDown();
          if (!this.checkValid()) {
            this.tetromino.moveUp();
            this.tetrominoNew = true;
            this.tetromino.locked = true;
            this.checkGameOver();
          }

        }
        this.showTetromino();
      } else {
        this.showTetromino();
        this.tetrominoNew = false;
      }
    }
  };

  Grid.prototype.start = function() {
    var that = this;
    var loopFun = function() {
      if (!that.gameOver) {
        if (!that.paused) {
          that.checkNewTetromino();
          that.run();
          that.render();
        }
        setTimeout(function() {
          requestAnimationFrame(loopFun);
        }, 1000 / that.speed);
      } else {
        if (!that.quiet) {
          if (that.eventHandler) {
            var eventData = {
              type: 'stop',
              data: {
                score: that.score,
                id: that.canvasId,
                win: that.gameResult,
                forceStop: that.forceStopFlag
              }
            };
            that.eventHandler.apply(that.eventContext, [eventData]);
          }
        }
        that.cleanGrid();
      }
    };

    loopFun();
  };

  Grid.prototype.getTetromino = function() {
    return Tetromino.create();
  };

  Grid.prototype.setEventHandler = function(handler, context) {
    this.eventHandler = handler;
    this.eventContext = context;
  };

  Grid.prototype.togglePause = function(pause) {
    if (pause !== undefined) {
      this.paused = !!pause;
    } else {
      this.paused = !this.paused;
    }
    return this.paused;
  };

  Grid.prototype.handleInput = function(event) {
    var key = event.keyCode;
    if (!key) {
      return;
    }

    console.log('Grid ' + this.canvasId + ' handleInput : ' + key);

    if (!this.tetrominoNew && this.tetromino) {
      switch(key) {
        // A and left
        case this.inputHandler.KEY_LEFT:
          this.hideTetromino();
          this.tetromino.moveLeft();
          if (!this.checkValid()) {
            this.tetromino.moveRight();
          }
          this.showTetromino();
          break;

        // W and up
        case this.inputHandler.KEY_UP:
          this.hideTetromino();
          this.tetromino.rotateLeft();
          if (!this.checkValid()) {
            this.tetromino.rotateRight();
          }
          this.showTetromino();
          break;

        // D and right
        case this.inputHandler.KEY_RIGHT:
          this.hideTetromino();
          this.tetromino.moveRight();
          if (!this.checkValid()) {
            this.tetromino.moveLeft();
          }
          this.showTetromino();
          break;

        // down and s
        case this.inputHandler.KEY_DOWN:
          this.hideTetromino();
          this.tetromino.moveDown();
          if (!this.checkValid()) {
            this.tetromino.moveUp();
          }
          this.showTetromino();
          break;

        default : break;
      }
    }
  };

  /*
   * exports
   */
   exports.Grid = Grid;

})(window);
