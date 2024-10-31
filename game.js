var platform;
var sprites = ["tryhard", "hazmat", "explorer"];
var spriteNum = 0;
var spacePressed = false;
var paused = false;
var start = false;
var won = false;
var score = 0;
var scoreText;
var level = 1;
var fruitsCollected = 0;
var normalSpeed = 160;
var slowSpeed = 80;
var speedModifierActive = false;
var doorSprite;
var timerText;
var timer = 40;
var timerPause = false
var timerEvent;

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
  parent: 'game-container'
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
  this.load.spritesheet("coin", "assets/coin.png", {
    frameWidth: 16,
    frameHeight: 16,
  });
  this.load.spritesheet("fruit", "assets/fruit.png", {
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
  this.add.image(400, 85.5, "plant-edge-up");
  this.add.image(400, 517.5, "plant-edge-down");
  platform = this.physics.add.staticGroup();
  door = this.physics.add.staticGroup();

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
  doorSprite = door.create(755, 330, "vertical-wall");
  platform.create(755, 270, "vertical-wall");
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
  doorCollider = this.physics.add.collider(player, doorSprite);
  player.setSize(20, 35);

  //score text
  scoreText = this.add.text(16, 16, "Score: 0", {
    fontSize: "32px",
    fill: "#fff",
  });

  //coins
  this.anims.create({
    key: "spin",
    frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 12 }),
    frameRate: 10,
    repeat: -1,
  });

  createCollectibles.call(this);

  this.physics.add.collider(player, platform);

  //timer text
  timerText = this.add.text(630, 16, "Time: 40", {
    fontSize: "32px",
    fill: "#fff",
  });

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
  startText = this.add
    .text(400, 300, "Press Enter to Start Game.", {
      fontSize: "32px",
      fill: "#FFF",
    })
    .setOrigin(0.5, 0.5)
    .setDepth(1);
}

function update() {
  if (won) return;
  if (start) {
    player.setVelocity(0);
      if (cursors.space.isDown && !spacePressed){
        spriteNum = (spriteNum +1) % sprites.length;
        player.setTexture(sprites[spriteNum]);
        spacePressed = false;
    }
    else if(cursors.space.isUp){
        spacePressed = false;
    }

    if (cursors.left.isDown) {
      player.setVelocityX(speedModifierActive ? -slowSpeed : -normalSpeed);
    } else if (cursors.right.isDown) {
      player.setVelocityX(speedModifierActive ? slowSpeed : normalSpeed);
    }

    if (cursors.up.isDown) {
      player.setVelocityY(speedModifierActive ? -slowSpeed : -normalSpeed);
    } else if (cursors.down.isDown) {
      player.setVelocityY(speedModifierActive ? slowSpeed : normalSpeed);
    }
    if (player.x > 770) {
      winGame(this);
    }

    if (Phaser.Input.Keyboard.JustDown(escapeKey)) {
      if (!paused) {
        pauseGame(this);
      } else {
        resumeGame(this);
      }
    }
  } else {
    this.overlay.setVisible(true);
    if (Phaser.Input.Keyboard.JustDown(enterKey)) {
      startGame(this);
      timerEvent = this.time.addEvent({
        delay: 1000,
        callback: updateTimer,
        callbackScope: this,
        loop: true,
      });
    }
  }
}

function pauseGame(scene) {
  paused = true;
  timerPause = true;
  scene.physics.pause();
  scene.overlay.setVisible(true);
  pauseText = scene.add
    .text(400, 300, "Game Paused. Press ESC to Resume.", {
      fontSize: "32px",
      fill: "#FFF",
    })
    .setOrigin(0.5, 0.5)
    .setDepth(2);
}

function updateTimer() {
  if(!timerPause)
  timer -= 1;
  timerText.setText("Time: " + timer);

  if (timer <= 0) {
    timerEvent.destroy();
    loseGame(this);
  }
}

function loseGame(scene) {
  scene.physics.pause();
  scene.overlay.setVisible(true);
  loseText = scene.add
    .text(400, 300, "You Lose!", { fontSize: "32px", fill: "#FFF" })
    .setOrigin(0.5, 0.5)
    .setDepth(2);
}

function resumeGame(scene) {
  paused = false;
  timerPause = false;
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
  winText = scene.add
    .text(400, 300, "You Win!", { fontSize: "32px", fill: "#FFF" })
    .setOrigin(0.5, 0.5)
    .setDepth(1);
  scene.overlay.setVisible(true);
  scene.physics.pause();
  if (timerEvent) {
    timerEvent.destroy();
  }
  scene.time.delayedCall(3000, nextLevel, [scene], this);
}

function nextLevel(scene) {
  if (level >= 3) {
    endGame(scene);
    return;
  }
  player.setPosition(25, 150);
  timer = 40;
  fruitsCollected = 0;
  doorCollider.active = true;
  doorSprite.y = 330;
    timerText.setText("Time: " + timer);
  timerEvent = scene.time.addEvent({
    delay: 1000,
    callback: updateTimer,
    callbackScope: scene,
    loop: true,
  });
  level += 1;
  won = false;

  if (winText) {
    winText.destroy();
  }
  scene.overlay.setVisible(false);

  scene.physics.resume();

  createCollectibles.call(scene);
}

function endGame(scene) {
  if (winText) winText.destroy();
  scene.overlay.setVisible(true);
  scene.physics.pause();
  
  scene.add.text(400, 250, "Thank You for Playing!", {
    fontSize: "40px",
    fill: "#FFF",
  }).setOrigin(0.5, 0.5);
  
  scene.add.text(400, 350, `Final Score: ${score}`, {
    fontSize: "32px",
    fill: "#FFF",
  }).setOrigin(0.5, 0.5);
}

function createCollectibles() {
  const coinPosition = [
    { x: 90, y: 155 },
    { x: 120, y: 155 },
    { x: 150, y: 155 },
    { x: 300, y: 180 },
    { x: 300, y: 210 },
    { x: 300, y: 240 },
    { x: 300, y: 270 },
    { x: 700, y: 180 },
    { x: 700, y: 210 },
    { x: 700, y: 240 },
    { x: 700, y: 270 },
    { x: 200, y: 380 },
    { x: 170, y: 380 },
    { x: 140, y: 380 },
  ];
  const fruitPosition = [
    { x: 700, y: 150 },
    { x: 110, y: 380 },
  ];
  if (level >= 2) {
    coinPosition.push(
      { x: 530, y: 300 },
      { x: 530, y: 270 },
      { x: 530, y: 240 },
      { x: 530, y: 210 },
      { x: 530, y: 180 },
      { x: 530, y: 425 },
      { x: 500, y: 425 },
      { x: 470, y: 425 },
      { x: 440, y: 425 },
      { x: 410, y: 425 }
    );

    fruitPosition.push({ x: 450, y: 155 }, { x: 340, y: 425 });
  }
  if (level >= 3) {
    coinPosition.push(
      { x: 620, y: 290 },
      { x: 620, y: 260 },
      { x: 620, y: 230 },
      { x: 620, y: 200 },
      { x: 170, y: 230 },
      { x: 140, y: 230 },
      { x: 200, y: 230 },
      { x: 200, y: 260 },
      { x: 200, y: 290 }
    );

    fruitPosition.push({ x: 620, y: 150 }, { x: 200, y: 320 });
  }

  coinPosition.forEach((position) => {
    const coin = this.physics.add.sprite(position.x, position.y, "coin");
    coin.setCollideWorldBounds(true);
    coin.setBounce(1);
    coin.anims.play("spin");
    this.physics.add.overlap(player, coin, collectCoin, null, this);
  });

  fruitPosition.forEach((position) => {
    const fruit = this.physics.add.sprite(position.x, position.y, "fruit");
    fruit.setCollideWorldBounds(true);
    this.physics.add.overlap(player, fruit, collectFruit, null, this);
  });
}

function collectCoin(player, coin) {
  coin.destroy();
  score += 1;
  scoreText.setText("Score: " + score);
}

function collectFruit(player, fruit) {
  fruit.destroy();
  fruitsCollected += 1;
  if (fruitsCollected >= level * 2) {
    doorSprite.y = 270;
    doorCollider.active = false;
  }
  if (!speedModifierActive) {
    player.setVelocityX(slowSpeed);
    player.setVelocityY(slowSpeed);
    speedModifierActive = true;

    setTimeout(() => {
      player.setVelocityX(normalSpeed);
      player.setVelocityY(normalSpeed);
      speedModifierActive = false;
    }, 3000);
  }
}

const game = new Phaser.Game(config);
