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
  this.add.image(0, 0, 'background').setOrigin(0, 0);  

  
  // Add sprite to live along and underneath the game screen. Call it the fence
  
  bottomFence = this.physics.add.sprite(
    game.config.height-5,
    game.config.width,
    "fence"
  );
  
 var ball = new Ball(this);
  bottomFence.body.immovable = true; 
  console.log('sprites:');
  console.log(bottomFence);
  console.log(ball);

  //bottomFence.fillStyle(0xffff00, 1);
  //bottomFence.fillRoundedRect(0, game.config.height-5, game.config.width, 5, 0);
  //this.physics.add.existing(bottomFence);
  //bottomFence.body.setSize(5, game.config.width);

  // bottomFence.body.velocity.x = 0;
  // bottomFence.body.velocity.y = 0;
  //bottomFence.body.bounce.x = 1;
  //bottomFence.body.bounce.y = 1;
  // bottomFence.body.collideWorldBounds = true;

  // Add our images (ball, paddles) as sprites, objects that we can assign physical properties and animation. 
  // sprites live in the scope of the scene
  /*
  ball = this.physics.add.sprite(
    game.config.width * 0.5, //was this.world.width * 0.5;
    game.config.height - 75,
    "ball"
  );
  */
  paddleBottom = this.physics.add.sprite(
    game.config.width / 2,
    game.config.height,
    "paddle"
  );
  paddleTop = this.physics.add.sprite(game.config.width / 2, 0, "paddle");

  // Define the Origo of the sprite. 
  // when we position the x value of the sprite we now position the middle of the sprite, instead of the default left edge as in phaser 2.
  //  ball.setOrigin(0, 0.5);
  paddleBottom.setOrigin(0.5, 1);
  paddleTop.setOrigin(0.5, 1);

  // Adjust the scales of the sprites so that they fit relative to each other. 
  // We scale them down in x and y direction respectively (the two input parameters)
  //  ball.setScale(0.2, 0.2);
  paddleBottom.setScale(0.7, 0.2);
  paddleTop.setScale(-0.7, -0.2);

  // Make ball collide with the bounds of the world.
  //ball.body.setCollideWorldBounds(true);
  // But we don't want it to collide with the bottom!
  this.physics.world.checkCollision.down = false;
  // save bounds for checking when ball leaves screen in update function later in the script
  bounds = this.physics.world.bounds;
  // Let's make the ball bounce with zero loss - all energy is saved througout the collision.
  //  ball.setBounce(1);
  // And give the ball an initial speed and direction.
  //  ball.body.velocity.set(200, -200);
  
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


};

// Outside the functions we make these socket-connections that adjust the paddle positions when a user of the controllers emit an event.
socket.on("set-position-bottom", x => {
  setXpos(paddleBottom, x);
});
socket.on("set-position-top", x => {
  setXpos(paddleTop, x);
});

function update() {
  this.physics.add.collider(ball, paddleTop);
  this.physics.add.collider(ball, paddleBottom);
  //var listener = this.physics.world.on('overlap', listener);
  this.physics.add.overlap(ball, bottomFence, ballLeaveScreen, null, this);

//this.events.once('listener', ballLeaveScreen, this);

  // Turn on left and right arrow for bottom paddle
  if (cursors.left.isDown && paddleBottom.x > paddleBottom.width / 2) {
    paddleBottom.x -= 5;
  } else if (
    cursors.right.isDown &&
    paddleBottom.x < game.config.width - paddleBottom.width / 2
  ) {
    paddleBottom.x += 5;
  };

  if (cursors.space.isDown) {
    ball.x = game.config.width / 2;
    ball.y = game.config.height / 2;
  }



/* Method 1 
  //Try to catch the event that the ball exits the screen 
  // Check if ball is out of bounds 
  // Need to only run the ballLeaveScreen() function once!!!!
  if (Phaser.Geom.Rectangle.Overlaps(bounds, ball.getBounds()) != true){
    // this.physics.pause(); // might use this when resetting the ball
    ball.disableBody(false, false);
    ballLeaveScreen();
  };
*/

};



/* Method 2
Make a sprite that lives along and underneath 
the screen and run the function when ball collides with this
*/

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
  //if (ballIsOut) return;
  //this.physics.pause();
  ball.disableBody(true, true);
  lives--;
  console.log('hi ballLeave');
  if (lives) {
    livesText.setText("Lives: " + lives);
    livesLostText.visible = true;
    ball.x = game.config.width / 2;
    ball.y = game.config.height / 2;
    ball.disableBody(false, false);
    // ball.reset(game.config.width / 2, game.config.height - 45);
    ballIsOut = false;
    console.log('hi ballLeave lives');
    
    //paddleBottom.reset(game.config.width / 2, game.config.height);
    
    if (cursors.space.isDown) {
      livesLostText.visible = false;
      ball.body.velocity.set(150, -150);
      console.log('hi space');

    };
  } else {
    alert("Game over!");
    location.reload();
  }
};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;
  console.log('hi debounce');
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

// Tried to store the debounced function as a variable, but it only runs the function...
// var debouncedBallLeaveScreen = debounce(ballLeaveScreen, 3000);
