var sprites = ["tryhard", "hazmat", "explorer"];
var spriteNum = 0;
var spacePressed = false;
var score = 0;
var scoreText;

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#115D81",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

function preload() {
  //ground
  this.load.image("mid-up", "assets/ground_002-modified.png");
  this.load.image("left-up", "assets/ground_001.png");
  this.load.image("right-up", "assets/ground_003.png");
  this.load.image("left-down", "assets/ground_007.png");
  this.load.image("right-down", "assets/ground_009.png");
  this.load.image("mid-down", "assets/ground_008-modified.png");
  this.load.image("mid", "assets/ground_005-modified.png");

  //plants
  this.load.image("plant-edge-up", "assets/plants_vines_005-modified.png");
  this.load.image(
    "plant-edge-down",
    "assets/plants_vines_005-modified - copy.png"
  );
  this.load.image("plant-water", "assets/plants_vines_002.png");
  this.load.image("plant-temp", "assets/plants_plant_01.png");
  this.load.image("plant-temp2", "assets/plants_plant_03.png");
  this.load.image("plant-temp3", "assets/plants_plant_04.png");

  //maze
  this.load.image("vertical-wall", "assets/top_02.jpg");
  this.load.image("horiz-wall", "assets/top_02 - copy.jpg");

  //sprites
  this.load.image("tryhard", "assets/characters/tryhard0010.png");
  this.load.image("hazmat", "assets/characters/animations0054.png");
  this.load.image("explorer", "assets/characters/explorer0065.png");

  //collectibles
  this.load.spritesheet('coin', 'assets/coin.png', {
    frameWidth: 16,
    frameHeight: 16,
  });
}

function create() {
  //ground
  this.add.image(400, 97.5, "mid-up");
  this.add.image(400, 300, "mid");
  this.add.image(400, 502.5, "mid-down");

  //plants
  
  
  platform = this.physics.add.staticGroup();

  //maze
  platform.create(15, 97.5, "left-up");
  platform.create(15, 502.5, "left-down");
  platform.create(785, 97.5, "right-up");
  platform.create(785, 502.5, "right-down");
  platform.create(45, 340.5, "vertical-wall");
  platform.create(145, 190.5, "horiz-wall").setScale(0.8).refreshBody();
  platform.create(175, 120.5, "horiz-wall");
  platform.create(400, 120.5, "horiz-wall").setScale(0.5).refreshBody();
  platform.create(625, 120.5, "horiz-wall");
  platform.create(255, 270.5, "vertical-wall").setScale(0.5).refreshBody();
  platform.create(190, 350, "horiz-wall").setScale(0.5).refreshBody();
  platform.create(125, 300, "vertical-wall").setScale(0.3).refreshBody();
  platform.create(660, 205, "vertical-wall").setScale(0.5).refreshBody();
  platform.create(420, 190, "horiz-wall").setScale(0.5).refreshBody();
  platform.create(420, 200, "vertical-wall").setScale(0.5).refreshBody();
  platform.create(420, 280, "horiz-wall").setScale(0.5).refreshBody();
  platform.create(570, 220, "vertical-wall").setScale(0.6).refreshBody();
  //bottom
  platform.create(755, 270, "vertical-wall");
  platform.create(145, 190.5, "horiz-wall").setScale(0.8).refreshBody();
  platform.create(175, 470.5, "horiz-wall");
  platform.create(400, 470.5, "horiz-wall").setScale(0.5).refreshBody();
  platform.create(625, 470.5, "horiz-wall");
  platform.create(315, 410, "vertical-wall").setScale(0.3).refreshBody();
  platform.create(240, 410, "horiz-wall").setScale(0.5).refreshBody();
  platform.create(465, 380, "horiz-wall");

  platform.create(680, 410, "vertical-wall").setScale(0.3).refreshBody();

  //sprite
  player = this.physics.add.sprite(25, 150, sprites[spriteNum]);
  player.setCollideWorldBounds(true);
  this.physics.add.collider(player, platform);
  player.setSize(20, 35);

  //score text
  scoreText = this.add.text(16, 16, "Score: 0", {
    fontSize: "32px",
    fill: "#fff",
  });

  //coins
  this.anims.create({
    key: 'spin',
    frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 12 }),
    frameRate: 10,
    repeat: -1
  });
  
  createCollectibles.call(this);

  this.physics.add.collider(player, platform);

  //game
  cursors = this.input.keyboard.createCursorKeys();
  spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

  
}

function update() {
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
    }

  function createCollectibles() {
    for (let i = 0; i < 10; i++) {
      const coin = this.physics.add.sprite(
        Math.random() * (710 - 90) + 90,// 90 min 710 max
        Math.random() * (430 - 155) + 155,// 155 min 430 max
        "coin"
      );
      coin.setCollideWorldBounds(true);
      coin.setBounce(1);
      coin.anims.play('spin'); 
      this.physics.add.overlap(player, coin, collectCoin, null, this);
    }
  }

function collectCoin(player, coin) {
  coin.destroy();
  score += 1;
  scoreText.setText("Score: " + score);
}


const game = new Phaser.Game(config);