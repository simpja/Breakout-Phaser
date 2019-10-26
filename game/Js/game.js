// Initiate socket object
var socket = io();

function setXpos(paddle, newX) {
  const paddleWidth = Math.abs(paddle.width);
  // | --===--- |
  // total amount of pixels available
  const multiplier = (game.world.width - paddleWidth) / 100;

  // newX is a number from 0 to 100
  paddle.x = newX * multiplier + paddleWidth / 2;
}

var game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
  preload: preload,
  create: create,
  update: update
});

// Variable decalaration
var ball;
var paddleBottom;
var paddleTop;
var bricks;
var newBrick;
var brickInfo;
var scoreText;
var score = 0;
var lives = 3;
var livesText;
var lifeLostText;
var cursors;
var spacebar;

function preload() {
  //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  //Scales the given ratio up or down to fit the available space on the screen
  this.scale.pageAlignHorizontally = true;
  //Aligns the canvas in the middle between top and bottom of the screen
  this.scale.pageAlignVertically = true;
  //The same as over, but in the middle of left and right
  this.stage.backgroundColor = "#b356a8";
  this.load.image("ball", "Assets/img/ball.png");
  this.load.image("paddle", "Assets/img/paddle.png");
  this.load.image("brick", "Assets/img/brick.png");
}

function create() {
  this.physics.startSystem(Phaser.Physics.ARCADE);
  ball = this.add.sprite(
    this.world.width * 0.5,
    this.world.height - 45,
    "ball"
  );
  paddleBottom = this.add.sprite(
    this.world.width / 2,
    this.world.height,
    "paddle"
  );
  paddleTop = this.add.sprite(this.world.width / 2, 0, "paddle");
  // Adds our images (ball, paddle) into a sprite, an object that we can assign physical properties later
  ball.anchor.set(0.5);
  paddleBottom.anchor.set(0.5, 1);
  paddleTop.anchor.set(0.5, 1);
  // Defines the Origo of the sprite. when we position the x value of the
  // sprite we now position the middle of the sprite, instead of the default left edge.
  ball.scale.setTo(0.2, 0.2);
  paddleBottom.scale.setTo(0.7, 0.2);
  paddleTop.scale.setTo(-0.7, -0.2);
  // The image is too big, so we scale it down equally x and y (the two input parameters)
  this.physics.enable(ball, Phaser.Physics.ARCADE);

  this.physics.enable(paddleBottom, Phaser.Physics.ARCADE);
  this.physics.enable(paddleTop, Phaser.Physics.ARCADE);

  ball.body.collideWorldBounds = true;
  ball.body.bounce.set(1);
  ball.body.velocity.set(200, -200);
  this.physics.arcade.checkCollision.down = false;
  // this.physics.arcade.checkCollision.up = false;
  ball.checkWorldBounds = true;
  ball.events.onOutOfBounds.add(ballLeaveScreen, this);

  paddleBottom.body.immovable = true; //Makes the paddle unmovable when colliding with the ball

  //Test av friction
  paddleBottom.body.friction.x = 1; //Looks good, doesn't work.

  paddleTop.body.immovable = true; //Makes the paddle unmovable when colliding with the ball
  // initBricks();
  scoreText = this.add.text(5, 5, "Points: " + score, {
    font: "10px Arial",
    fill: "#0095DD"
  });
  livesText = this.add.text(this.world.width - 5, 5, "Lives: " + lives, {
    font: "10px Arial",
    fill: "#0095DD"
  });
  livesText.anchor.set(1, 0);
  livesLostText = this.add.text(
    this.world.width / 2,
    this.world.height / 2,
    "Life lost, press space to continue",
    {
      font: "10px Arial",
      fill: "#0095DD"
    }
  );
  livesLostText.anchor.set(1, 0);
  livesLostText.visible = false;

  // Adding arrow key movement
  cursors = this.input.keyboard.createCursorKeys();
  spacebar = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
  enter = this.input.keyboard.addKey(Phaser.KeyCode.ENTER);
}

socket.on("set-position-bottom", x => {
  setXpos(paddleBottom, x);
});
socket.on("set-position-top", x => {
  setXpos(paddleTop, x);
});

function update() {
  this.physics.arcade.collide(ball, paddleTop);
  this.physics.arcade.collide(ball, paddleBottom);
  this.physics.arcade.collide(ball, bricks, ballHitBrick);
  //paddle.x = this.input.x || this.world.width / 2;
  // update the position of the paddle to the input x value. If th input x value
  // does not exists, it will set it to the middle.

  /*
  if (cursors.left.isDown && paddle.x > paddle.width / 2) {
    paddle.x -= 5;
  } else if (
    cursors.right.isDown &&
    paddle.x < this.world.width - paddle.width / 2
  ) {
    paddle.x += 5;
  }
  */
}

function ballHitBrick(ball, brick) {
  brick.kill();
  score += 10;
  scoreText.setText("Points: " + score);

  var count_alive = 0;
  for (i = 0; i < bricks.children.length; i++) {
    if (bricks.children[i].alive == true) {
      count_alive++;
    }
  }
  if (count_alive == 0) {
    alert("You won the game maddaffaakakak!");
    location.reload();
  }
}

function ballLeaveScreen() {
  lives--;
  if (lives) {
    livesText.setText("Lives: " + lives);
    livesLostText.visible = true;
    ball.reset(this.world.width / 2, this.world.height - 45);
    paddleBottom.reset(this.world.width / 2, this.world.height);

    spacebar.onDown.addOnce(() => {
      livesLostText.visible = false;
      ball.body.velocity.set(150, -150);
    }, this);
  } else {
    alert("Game over!");
    location.reload();
  }
}

function initBricks() {
  brickInfo = {
    width: 50,
    height: 20,
    count: {
      row: 3,
      col: 7
    },
    offset: {
      top: 30,
      left: 40
    },
    padding: 18
  };
  bricks = this.add.group();
  for (c = 0; c < brickInfo.count.col; c++) {
    for (r = 0; r < brickInfo.count.row; r++) {
      var brickX =
        c * (brickInfo.width + brickInfo.padding) + brickInfo.offset.left;
      var brickY =
        r * (brickInfo.height + brickInfo.padding) + brickInfo.offset.top;
      newBrick = this.add.sprite(brickX, brickY, "brick");
      newBrick.scale.setTo(0.45, 0.45);
      this.physics.enable(newBrick, Phaser.Physics.ARCADE);
      newBrick.body.immovable = true;
      newBrick.anchor.set(0.5);
      bricks.add(newBrick);
    }
  }
}
