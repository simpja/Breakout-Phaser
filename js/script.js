var game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
  preload: preload,
  create: create,
  update: update
});

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  //Scales the given ratio up or down to fit the available space on the screen
  game.scale.pageAlignHorizontally = true;
  //Aligns the canvas in the middle between top and bottom of the screen
  game.scale.pageAlignVertically = true;
  //The same as over, but in the middle of left and right
  game.stage.backgroundColor = "#ffccdd";
}

function create() {}

function update() {}
