var platform;
var sprites=['tryhard','hazmat','explorer'];
var spriteNum=0;
var spacePressed = false;
var paused = false;
var start = false;
var won = false;

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
        update,

    }
}



function preload(){
    //ground
    this.load.image('mid-up','assets/ground_002-modified.png')
    this.load.image('left-up','assets/ground_001.png')
    this.load.image('right-up','assets/ground_003.png')
    this.load.image('left-down','assets/ground_007.png')
    this.load.image('right-down','assets/ground_009.png')
    this.load.image('mid-down','assets/ground_008-modified.png')
    this.load.image('mid','assets/ground_005-modified.png')


    //plants
    this.load.image('plant-edge-up','assets/plants_vines_005-modified.png')
    this.load.image('plant-edge-down','assets/plants_vines_005-modified - copy.png')
    this.load.image('plant-water','assets/plants_vines_002.png')
    this.load.image('plant-temp','assets/plants_plant_01.png')
    this.load.image('plant-temp2','assets/plants_plant_03.png')
    this.load.image('plant-temp3','assets/plants_plant_04.png')



    //maze
    this.load.image('vertical-wall','assets/top_02.jpg')
    this.load.image('horiz-wall','assets/top_02 - copy.jpg')

    //sprites
    this.load.image('tryhard', 'assets/characters/tryhard0010.png',)
    this.load.image('hazmat', 'assets/characters/animations0054.png',)
    this.load.image('explorer', 'assets/characters/explorer0065.png',)
}

function create(){
    //ground
    this.add.image((400),(97.5),'mid-up')
    this.add.image((400),(300),'mid')
    this.add.image((400),(502.5),'mid-down')

    //plants
    this.add.image((400),(85.5),'plant-edge-up')
    this.add.image((400),(517.5),'plant-edge-down')
    for(var i =0 ; i<12;i++){
        this.add.image(
        Math.floor(Math.random() * 800 + 1),
        (Math.floor(Math.random() * 65 + 517)),
        'plant-water');

    this.add.image(
        Math.floor(Math.random() * 800 + 1),
        (Math.floor(Math.random() * 80 + 2)),
        'plant-water');

    this.add.image(
        Math.floor(Math.random() * 800 + 1),
        (Math.floor(Math.random() * 450 + 90)),
        'plant-temp');
    this.add.image(
        Math.floor(Math.random() * 800 + 1),
        (Math.floor(Math.random() * 450 + 90)),
        'plant-temp2');
    this.add.image(
        Math.floor(Math.random() * 800 + 1),
        (Math.floor(Math.random() * 450 + 90)),
        'plant-temp3');
}
platform = this.physics.add.staticGroup();

    //maze
platform.create((15),(97.5),'left-up')
platform.create((15),(502.5),'left-down')
platform.create((785),(97.5),'right-up')
platform.create((785),(502.5),'right-down')
platform.create((45),(340.5),'vertical-wall')
platform.create((145),(190.5),'horiz-wall').setScale(0.8).refreshBody();
platform.create((175),(120.5),'horiz-wall')
platform.create((400),(120.5),'horiz-wall').setScale(0.5).refreshBody();
platform.create((625),(120.5),'horiz-wall')
platform.create((255),(270.5),'vertical-wall').setScale(0.5).refreshBody();
platform.create((190),(350),'horiz-wall').setScale(0.5).refreshBody();
platform.create((125),(300),'vertical-wall').setScale(0.3).refreshBody();
platform.create((660),(205),'vertical-wall').setScale(0.5).refreshBody();
platform.create((420),(190),'horiz-wall').setScale(0.5).refreshBody();
platform.create((420),(200),'vertical-wall').setScale(0.5).refreshBody();
platform.create((420),(280),'horiz-wall').setScale(0.5).refreshBody();
platform.create((610),(190),'horiz-wall').setScale(0.3).refreshBody();
platform.create((570),(220),'vertical-wall').setScale(0.6).refreshBody();
//bottom
platform.create((755),(270),'vertical-wall')
platform.create((145),(190.5),'horiz-wall').setScale(0.8).refreshBody();
platform.create((175),(470.5),'horiz-wall')
platform.create((400),(470.5),'horiz-wall').setScale(0.5).refreshBody();
platform.create((625),(470.5),'horiz-wall')
platform.create((315),(410),'vertical-wall').setScale(0.3).refreshBody();
platform.create((240),(410),'horiz-wall').setScale(0.5).refreshBody();
platform.create((465),(380),'horiz-wall')
platform.create((400),(430),'vertical-wall').setScale(0.25).refreshBody();
platform.create((680),(410),'vertical-wall').setScale(0.3).refreshBody();

//sprite
player = this.physics.add.sprite(25, 150,sprites[spriteNum]);
player.setCollideWorldBounds(true);
this.physics.add.collider(player, platform);
player.setSize(20,35);

//game
cursors = this.input.keyboard.createCursorKeys();
spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // Overlay for pause
this.overlay = this.add.graphics();
this.overlay.fillStyle(0x000000, 0.5);
this.overlay.fillRect(0, 0, 800, 600);
this.overlay.setVisible(false);
startText = this.add.text(400, 300, 'Press Enter to Start Game.', { fontSize: '32px', fill: '#FFF' })
.setOrigin(0.5, 0.5).setDepth(1);
}

function update() {
    if(won)
        return;
    if(start){

    player.setVelocity(0);

    if (cursors.space.isDown && !spacePressed){
        spriteNum = (spriteNum +1) % sprites.length;
        player.setTexture(sprites[spriteNum]);
        spacePressed = false;
    }
    else if(cursors.space.isUp){
        spacePressed = false;
    }


    if (cursors.right.isDown) {
        player.setVelocityX(160);
    }
    else if (cursors.left.isDown) {
        player.setVelocityX(-160);
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-160);
    }
    else if (cursors.down.isDown) {
        player.setVelocityY(160);
    }
    if(player.x>770){
        winGame(this);
    console.log(player.x);
    }

    if (Phaser.Input.Keyboard.JustDown(escapeKey)) {

        if(!paused){
        console.log("pause");
        pauseGame(this);
    }
    else {
    resumeGame(this);

    }
}
}
    else{
        this.overlay.setVisible(true);
            if (Phaser.Input.Keyboard.JustDown(enterKey)) {
                startGame(this);
                 }

    }
}
function pauseGame(scene) {
    paused = true;
    scene.physics.pause();
    scene.overlay.setVisible(true);
    pauseText = scene.add.text(400, 300, 'Game Paused. Press ESC to Resume.', { fontSize: '32px', fill: '#FFF' })
    .setOrigin(0.5, 0.5).setDepth(2);
}

function resumeGame(scene) {
    paused = false;
    scene.physics.resume();
    scene.overlay.setVisible(false);
    if (pauseText) {
        pauseText.destroy();
        pauseText = null;
    }
}

function startGame(scene) {
    start = true;
    scene.overlay.setVisible(false);
    startText.setVisible(false);
}

function winGame(scene) {
    won = true;
    winText = scene.add.text(400, 300, 'You Win!', {fontSize: '32px',fill: '#FFF'}).setOrigin(0.5, 0.5).setDepth(1);
    scene.overlay.setVisible(true);
    scene.physics.pause();

}

    const game = new Phaser.Game(config);

