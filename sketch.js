var trex, trex_running, trex_collided;
var ground, groundImage;
var invisibleGround; 
var rand;
var cloud;
var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score = 0;  
var bird, bird_Image;
var restart, restartImage;
var gameOver, gameOverImage;

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var currentFrame = 0;
var sample = "This is to again test";

var jumpSound, dieSound, checkPointSound;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_jump = loadAnimation("trex1.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png")
  cloudImage = loadImage("cloud.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  birdImage = loadAnimation("Trex_Bird1.png","Trex_Bird2.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  
  restartImage = loadImage("restart.png");
  gameOverImage = loadImage("gameOver.png");
}

function setup() {
createCanvas(600, 200);

  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("jump",trex_jump);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;
  //trex.debug = true;
  trex.setCollider("circle",0,0,45);

  //create a ground sprite
  ground = createSprite(300,180,600,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;

  //create an invisible ground
  invisibleGround = createSprite(300,190,600,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  //var rand = Math.round(random(1,100));
  //console.log(rand);
  
  restart = createSprite(300,140);
  restart.addImage(restartImage);
  restart.scale = 0.4;
  restart.visible = false;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
}

function draw() {
  //console.log(sample);
  //set background color
  background("pink");
  console.log(trex.y);
  //To display score system
  text("Score: " + score, 500,50);
  //console.log(Math.round(frameRate()/65));
  if (gameState === PLAY){
    ground.velocityX = -4;
    
    score = score + Math.round(frameRate()/60);
    
    if((score % 100 === 0) && score>0 ){
      checkPointSound.play();
    }
    
    if (ground.x < 0) {
    ground.x = ground.width / 2;
    }
    
    //jump when the space button is pressed
    if (keyDown("space") && trex.y>=162.5) {
      trex.velocityY = -10;
      jumpSound.play();
    }
    
    //trex.changeAnimation("running");
    trex.velocityY = trex.velocityY + 0.5;
    
    //Spawn the clouds & obstacles
    spawnClouds();
    spawnObstacles();
    spawnBirds();
    
    //to check if trex touches any of the obstacles
    if(obstaclesGroup.isTouching(trex)){
      dieSound.play();
      gameState = END;
    }
  }
  
  else if (gameState === END){
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    trex.changeAnimation("collided");
    restart.visible = true;
    gameOver.visible = true;
  }
  
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)){
    reset();
  }
    
  drawSprites();
}


function reset(){
  gameState = PLAY;
  score = 0;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running");
  restart.visible = false;
  gameOver.visible = false;
}

function spawnObstacles() {
  if (frameCount % 60 == 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -6;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    //obstacle.debug = true;
    //assign scale and lifetime to obstacle
    obstacle.lifetime = 120;
    obstacle.scale = 0.5;
    obstacle.depth = trex.depth;
    //obstacle.debug = true;
    //console.log(obstacle.depth);
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds(){
  if (frameCount % 60 == 0){
    cloud = createSprite(600,100,40,10);
    cloud.addImage(cloudImage);
    cloud.y = Math.round(random(50,120));
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    cloud.lifetime = 210;
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
    
    //console.log(trex.depth);
    //console.log(cloud.depth); 
  }
}

function spawnBirds(){
  var choice = [41, 83, 99, 119];
  var r = random(choice);
  if((frameCount % r == 0) && (frameCount - currentFrame > 70)){
    currentFrame = frameCount;
    bird = createSprite(600,Math.round(random(30,120)),10,10);
    bird.addAnimation("bird", birdImage);
    bird.velocityX = -9;
    bird.scale = 0.5;
    //console.log("Frame Count: "+frameCount+" random # r: "+r);
  }
}