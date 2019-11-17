// Initiate socket object
var socket = io();

// Define a config object for Phaser3
var config = {
  type: Phaser.AUTO,
  width: 480,
  height: 320,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        x: 0,
        y: 0
      }
    }
  }
};

// Initiate phaser game object using HTML Canvas
var game = new Phaser.Game(config);

// Variable decalaration
var bounds;
var gameStatus = "start";
var ballIsOut;
var bottomFence;
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
  // this.scale.pageAlignHorizontally = true;
  //Aligns the canvas in the middle between top and bottom of the screen
  // this.scale.pageAlignVertically = true;
  //The same as over, but in the middle of left and right
  this.load.image("ball", "Assets/img/ball.png");
  this.load.image("paddle", "Assets/img/paddle.png");
  this.load.image("brick", "Assets/img/brick.png");
  this.load.image("background", "Assets/img/starsBackground.jpg");
  this.load.image("fence", "Assets/img/fence.png");
}

function create() {
  //Add image as background
  this.add.image(0, 0, "background").setOrigin(0, 0);

  // Add sprite to live along and underneath the game screen. Call it the fence

  bottomFence = this.physics.add.sprite(
    game.config.height - 5,
    game.config.width,
    "fence"
  );
  // We don't want our fence to move (:
  bottomFence.body.immovable = true;

  // Add our images (ball, paddles) as sprites, objects that we can assign physical properties and animation.
  // sprites live in the scope of the scene
  ball = this.physics.add.sprite(
    game.config.width * 0.5, //was this.world.width * 0.5;
    game.config.height - 75,
    "ball"
  );
  paddleBottom = this.physics.add.sprite(
    game.config.width / 2,
    game.config.height,
    "paddle"
  );
  paddleTop = this.physics.add.sprite(game.config.width / 2, 0, "paddle");

  // Define the Origo of the sprite.
  // when we position the x value of the sprite we now position the middle of the sprite, instead of the default left edge as in phaser 2.
  ball.setOrigin(0, 0.5);
  paddleBottom.setOrigin(0.5, 1);
  paddleTop.setOrigin(0.5, 1);

  // Adjust the scales of the sprites so that they fit relative to each other.
  // We scale them down in x and y direction respectively (the two input parameters)
  ball.setScale(0.2, 0.2);
  paddleBottom.setScale(0.7, 0.2);
  paddleTop.setScale(-0.7, -0.2);

  // Make ball collide with the bounds of the world.
  ball.body.setCollideWorldBounds(true);
  // But we don't want it to collide with the bottom!
  this.physics.world.checkCollision.down = false;
  // save bounds for checking when ball leaves screen in update function later in the script
  bounds = this.physics.world.bounds;
  // Let's make the ball bounce with zero loss - all energy is saved througout the collision.
  ball.setBounce(1);
  // And give the ball an initial speed and direction.
  ball.body.velocity.set(200, -200);

  //Make the paddle unmovable when colliding with the ball
  paddleBottom.body.immovable = true;
  paddleTop.body.immovable = true;

  // Test av friction
  // paddleBottom.body.friction.x = 1; //Looks good, doesn't work.

  // Make the text objects to write lives remaining and score in.
  scoreText = this.add.text(5, 5, "Points: " + score, {
    font: "10px Arial",
    fill: "#0095DD"
  });
  livesText = this.add.text(game.config.width - 5, 5, "Lives: " + lives, {
    font: "10px Arial",
    fill: "#0095DD"
  });
  livesText.setOrigin(1, 0);
  livesLostText = this.add.text(
    game.config.width / 2,
    game.config.height / 2,
    "Life lost, press space to continue",
    {
      font: "10px Arial",
      fill: "#0095DD"
    }
  );
  livesLostText.setOrigin(1, 0);
  livesLostText.visible = false;

  // Adding arrow key + shift + spacebar listener as one common cursors-object
  cursors = this.input.keyboard.createCursorKeys();

  // we have a boolean that tells us if the ball is out of bounds
  ballIsOut = false;
  gameStatus = "running";
  this.physics.add.collider(ball, paddleTop);
  this.physics.add.collider(ball, paddleBottom);
  this.physics.add.overlap(ball, bottomFence, ballLeaveScreen, null, this);
}

// Outside the functions we make these socket-connections that adjust the paddle positions when a user of the controllers emit an event.
socket.on("set-position-bottom", x => {
  setXpos(paddleBottom, x);
});
socket.on("set-position-top", x => {
  setXpos(paddleTop, x);
});

function update() {
  // Check if game is paused, and reset if space is pushed
  if (cursors.space.isDown && gameStatus == "paused") {
    livesLostText.visible = false;
    ball.enableBody(
      true,
      game.config.width / 2,
      game.config.height / 2,
      true,
      true
    );
    ball.body.velocity.set(150, -150);
    gameStatus = "running";
  }
  // Turn on left and right arrow for bottom paddle
  if (cursors.left.isDown && paddleBottom.x > paddleBottom.width / 2) {
    paddleBottom.x -= 5;
  } else if (
    cursors.right.isDown &&
    paddleBottom.x < game.config.width - paddleBottom.width / 2
  ) {
    paddleBottom.x += 5;
  }
}

/* Method 2
Make a sprite that lives along and underneath 
the screen and run the function when ball collides with this
*/

// Functions following!

function setXpos(paddle, newX) {
  const paddleWidth = Math.abs(paddle.width);
  // | --===--- |
  // total amount of pixels available
  const multiplier = (game.config.width - paddleWidth) / 100;
  // newX is a number from 0 to 100
  paddle.x = newX * multiplier + paddleWidth / 2;
}

function ballLeaveScreen() {
  //if (ballIsOut) return;
  //this.physics.pause();
  gameStatus = "paused";
  ball.disableBody(true, false);
  lives--;
  if (lives) {
    livesText.setText("Lives: " + lives);
    livesLostText.visible = true;
    ball.enableB;
    // ball.reset(game.config.width / 2, game.config.height - 45);
    ballIsOut = false;

    //paddleBottom.reset(game.config.width / 2, game.config.height);
  } else {
    alert("Game over!");
    location.reload();
  }
}
