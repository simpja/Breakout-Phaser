// Initiate socket object
var socket = io();

// Define a config object for Phaser3
var config = {
  type: Phaser.AUTO,
  width: 480,
  height: 320,
  physics: {
    default: 'arcade',
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

// Initiate phaser game object using HTML Canvas
var game = new Phaser.Game(config);

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
  this.scale.pageAlignHorizontally = true;
  //Aligns the canvas in the middle between top and bottom of the screen
  this.scale.pageAlignVertically = true;
  //The same as over, but in the middle of left and right
  this.load.image("ball", "Assets/img/ball.png");
  this.load.image("paddle", "Assets/img/paddle.png");
  this.load.image("brick", "Assets/img/brick.png");
  this.load.image("background", "Assets/img/starsBackground.jpg")
}

function create() {
  this.add.image(0, 0, 'background').setOrigin(0, 0);
  //this.physics.startSystem(Phaser.Physics.ARCADE);
  ball = this.physics.add.sprite(
    this.scene.width * 0.5, //was this.world.widht * 0.5;
    this.scene.height - 45,
    "ball"
  );
  paddleBottom = this.physics.add.sprite(
    this.scene.width / 2,
    this.scene.height,
    "paddle"
  );
  paddleTop = this.physics.add.sprite(this.scene.width / 2, 0, "paddle");
  // Adds our images (ball, paddle) into a sprite, an object that we can assign physical properties later
  ball.setOrigin(0, 0.5);
  paddleBottom.setOrigin(0.5, 1);
  paddleTop.setOrigin(0.5, 1);
  // Defines the Origo of the sprite. when we position the x value of the
  // sprite we now position the middle of the sprite, instead of the default left edge.
  ball.setScale(0.2, 0.2);
  paddleBottom.setScale(0.7, 0.2);
  paddleTop.setScale(-0.7, -0.2);
  // The image is too big, so we scale it down equally x and y (the two input parameters)

  ball.body.collideWorldBounds = true;
  ball.setBounce(1);
  ball.body.velocity.set(200, -200);
  this.physics.arcade.checkCollision.down = false;
  // this.physics.arcade.checkCollision.up = false;
  ball.checkWorldBounds = true;
  ball.events.onOutOfBounds.add(ballLeaveScreen, this);

  paddleBottom.body.immovable = true; //Makes the paddle unmovable when colliding with the ball

  // Test av friction
  // paddleBottom.body.friction.x = 1; //Looks good, doesn't work.

  paddleTop.body.immovable = true; //Makes the paddle unmovable when colliding with the ball
  
  scoreText = this.add.text(5, 5, "Points: " + score, {
    font: "10px Arial",
    fill: "#0095DD"
  });
  livesText = this.add.text(this.scene.width - 5, 5, "Lives: " + lives, {
    font: "10px Arial",
    fill: "#0095DD"
  });
  livesText.setOrigin(1, 0);
  livesLostText = this.add.text(
    this.scene.width / 2,
    this.scene.height / 2,
    "Life lost, press space to continue",
    {
      font: "10px Arial",
      fill: "#0095DD"
    }
  );
  livesLostText.setOrigin(1, 0);
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
  this.physics.add.collider(ball, paddleTop);
  this.physics.add.collider(ball, paddleBottom);

  // Turn on left and right arrow for bottom paddle
  if (cursors.left.isDown && paddleBottom.x > paddleBottom.width / 2) {
    paddleBottom.x -= 5;
  } else if (
    cursors.right.isDown &&
    paddleBottom.x < this.scene.width - paddleBottom.width / 2
  ) {
    paddleBottom.x += 5;
  }

};

// Functions following!

function setXpos(paddle, newX) {
  const paddleWidth = Math.abs(paddle.width);
  // | --===--- |
  // total amount of pixels available
  const multiplier = (game.world.width - paddleWidth) / 100;
  // newX is a number from 0 to 100
  paddle.x = newX * multiplier + paddleWidth / 2;
}

function ballLeaveScreen() {
  lives--;
  if (lives) {
    livesText.setText("Lives: " + lives);
    livesLostText.visible = true;
    ball.reset(this.scene.width / 2, this.scene.height - 45);
    paddleBottom.reset(this.scene.width / 2, this.scene.height);

    spacebar.onDown.addOnce(() => {
      livesLostText.visible = false;
      ball.body.velocity.set(150, -150);
    }, this);
  } else {
    alert("Game over!");
    location.reload();
  }
}