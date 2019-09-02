// Initiate the socket stuff
var socket = io();

function handleSocketGameControl(event) {
  if (event == "left" && paddle.x > paddle.width / 2) {
    paddle.x -= 5;
  } else if (
    event == "right" &&
    paddle.x < game.world.width - paddle.width / 2
  ) {
    paddle.x += 5;
  }
}

function setXpos(newX) {
  // | --===--- |
  // totoal amount of pixels available
  const multiplier = (game.world.width - paddle.width) / 100;

  // newX is a number from 0 to 100
  paddle.x = newX * multiplier + paddle.width / 2;
}

var game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
  preload: preload,
  create: create,
  update: update
});

// Variable decalaration
var ball;
var paddle;
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

//get time (milliseconds since 1970...)
var date = new Date();
var milliSeconds = date.getTime();
var lastMilliSeconds = 0;

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  //Scales the given ratio up or down to fit the available space on the screen
  game.scale.pageAlignHorizontally = true;
  //Aligns the canvas in the middle between top and bottom of the screen
  game.scale.pageAlignVertically = true;
  //The same as over, but in the middle of left and right
  game.stage.backgroundColor = "#b356a8";
  game.load.image("ball", "Assets/img/ball.png");
  game.load.image("paddle", "Assets/img/paddle.png");
  game.load.image("brick", "Assets/img/brick.png");
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  ball = game.add.sprite(
    game.world.width * 0.5,
    game.world.height - 45,
    "ball"
  );
  paddle = game.add.sprite(game.world.width / 2, game.world.height, "paddle");
  // Adds our images (ball, paddle) into a sprite, an object that we can assign physical properties later
  ball.anchor.set(0.5);
  paddle.anchor.set(0.5, 1);
  // Defines the Origo of the sprite. when we position the x value of the
  // sprite we now position the middle of the sprite, instead of the default left edge.
  ball.scale.setTo(0.2, 0.2);
  paddle.scale.setTo(0.7, 0.2);
  // The image is too big, so we scale it down equally x and y (the two input parameters)
  game.physics.enable(ball, Phaser.Physics.ARCADE);
  game.physics.enable(paddle, Phaser.Physics.ARCADE);

  ball.body.collideWorldBounds = true;
  ball.body.bounce.set(1);
  ball.body.velocity.set(200, -200);
  game.physics.arcade.checkCollision.down = false;
  ball.checkWorldBounds = true;
  ball.events.onOutOfBounds.add(ballLeaveScreen, this);

  paddle.body.immovable = true; //Makes the paddle unmovable when colliding with the ball
  initBricks();
  scoreText = game.add.text(5, 5, "Points: " + score, {
    font: "10px Arial",
    fill: "#0095DD"
  });
  livesText = game.add.text(game.world.width - 5, 5, "Lives: " + lives, {
    font: "10px Arial",
    fill: "#0095DD"
  });
  livesText.anchor.set(1, 0);
  livesLostText = game.add.text(
    game.world.width / 2,
    game.world.height / 2,
    "Life lost, press space to continue",
    {
      font: "10px Arial",
      fill: "#0095DD"
    }
  );
  livesLostText.anchor.set(1, 0);
  livesLostText.visible = false;

  // Adding arrow key movement
  cursors = game.input.keyboard.createCursorKeys();
  spacebar = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
  enter = game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
}

socket.on("gameControl", event => {
  handleSocketGameControl(event);
});

socket.on("set-position", x => {
  setXpos(x);
});

function update() {
  game.physics.arcade.collide(ball, paddle);
  game.physics.arcade.collide(ball, bricks, ballHitBrick);
  //paddle.x = game.input.x || game.world.width / 2;
  // update the position of the paddle to the input x value. If th input x value
  // does not exists, it will set it to the middle.

  /*
  if (cursors.left.isDown && paddle.x > paddle.width / 2) {
    paddle.x -= 5;
  } else if (
    cursors.right.isDown &&
    paddle.x < game.world.width - paddle.width / 2
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
    ball.reset(game.world.width / 2, game.world.height - 45);
    paddle.reset(game.world.width / 2, game.world.height);

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
  bricks = game.add.group();
  for (c = 0; c < brickInfo.count.col; c++) {
    for (r = 0; r < brickInfo.count.row; r++) {
      var brickX =
        c * (brickInfo.width + brickInfo.padding) + brickInfo.offset.left;
      var brickY =
        r * (brickInfo.height + brickInfo.padding) + brickInfo.offset.top;
      newBrick = game.add.sprite(brickX, brickY, "brick");
      newBrick.scale.setTo(0.45, 0.45);
      game.physics.enable(newBrick, Phaser.Physics.ARCADE);
      newBrick.body.immovable = true;
      newBrick.anchor.set(0.5);
      bricks.add(newBrick);
    }
  }
}
