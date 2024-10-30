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
