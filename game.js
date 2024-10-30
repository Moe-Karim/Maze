var platform;
var sprites=['tryhard','hazmat','explorer'];
var spriteNum=0;
var spacePressed = false;

var config={
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#115D81",
    physics:{
        default:'arcade',
        arcade: {
        debug: false
    }
    },
    scene: {
        preload,
        create,
        update
    }
}

