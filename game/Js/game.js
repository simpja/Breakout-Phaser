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
    default: 'arcade',
    arcade: {
      // x: 0,
      // y: 0,
      // width: scene.sys.scale.width,
      // height: scene.sys.scale.height,
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
  this.load.image("background", "Assets/img/starsBackground.jpg")
  console.log(game.config.width);
}

function create() {
  this.add.image(0, 0, 'background').setOrigin(0, 0);
  //this.physics.startSystem(Phaser.Physics.ARCADE);
  ball = this.physics.add.sprite(
    game.config.width * 0.5, //was this.world.widht * 0.5;
    game.config.height - 45,
    "ball"
  );
  paddleBottom = this.physics.add.sprite(
    game.config.width / 2,
    game.config.height,
    "paddle"
  );
  paddleTop = this.physics.add.sprite(game.config.width / 2, 0, "paddle");
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

  ball.body.setCollideWorldBounds(true);
  this.physics.world.checkCollision.down = false;
  ball.setBounce(1);
  ball.body.velocity.set(200, -200);

 

  // logic for executing function when ball leaves screen
  // Old solution that doesn't work anymore...
   // ball.checkWorldBounds = true;
  //ball.events.onOutOfBounds.add(ballLeaveScreen, this);

  // new solution!
  //var bounds = this.physics.world.bounds.width;
  bounds = this.physics.world.bounds;
  
//  var spriteBounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(this.physics.world.bounds), -20, -20);

  paddleBottom.body.immovable = true; //Makes the paddle unmovable when colliding with the ball

  // Test av friction
  // paddleBottom.body.friction.x = 1; //Looks good, doesn't work.

  paddleTop.body.immovable = true; //Makes the paddle unmovable when colliding with the ball
  
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

  // Adding arrow key movement
  cursors = this.input.keyboard.createCursorKeys();
  //spacebar = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
  //enter = this.input.keyboard.addKey(Phaser.KeyCode.ENTER);
};

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
    paddleBottom.x < game.config.width - paddleBottom.width / 2
  ) {
    paddleBottom.x += 5;
  }

  // Check if ball is out of bounds 
  
  /*
      // Get all physics bodies within the physics rectangle (same as the camera rectangle for this scene.)
      var within = this.physics.overlapRect(bounds.x, bounds.y, bounds.width, bounds.height);
  
      within.forEach(function (body) {
          body.gameObject.setTint(0xff0000);
          console.log(body)
      });
      
*/
      if (Phaser.Geom.Rectangle.Overlaps(bounds, ball.getBounds()) != true){
        ballLeaveScreen();
      }
    
     //console.log(Phaser.Geom.Rectangle.Overlaps(bounds, ball.getBounds()))

};

// Functions following!

function setXpos(paddle, newX) {
  const paddleWidth = Math.abs(paddle.width);
  // | --===--- |
  // total amount of pixels available
  const multiplier = (game.scene.width - paddleWidth) / 100;
  // newX is a number from 0 to 100
  paddle.x = newX * multiplier + paddleWidth / 2;
}

function ballLeaveScreen() {
  lives--;
  console.log('hi');
  if (lives) {
    livesText.setText("Lives: " + lives);
    livesLostText.visible = true;
    ball.reset(game.config.width / 2, game.config.height - 45);
    paddleBottom.reset(game.config.width / 2, game.config.height);

    if (cursors.space.isDown) {
      livesLostText.visible = false;
      ball.body.velocity.set(150, -150);
    };
  } else {
    alert("Game over!");
    location.reload();
  }
}