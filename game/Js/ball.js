class Ball extends Phaser.GameObjects.Sprite{
    constructor(scene){
        console.log('ball class');
        
        var x = 200;
        var y = 200;
        super(scene, x, y, "ball");
    }
}