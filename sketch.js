//make all the variables for the gamestates
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//make the sprite variables
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
//score variable
var score;
//gameover images variables
var gameOverImg,restartImg,gameOver,restart;
//sound variables
var jumpSound , checkPointSound, dieSound
var array;

function preload(){
  //load trex animations
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  //loads images
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  //loads sounds
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  //creates canvas
  createCanvas(600, 200);
  array = [trex, ground, gameOver, restart, cloudsGroup, obstaclesGroup]

 //console test
 var message = "This is a message";
 console.log(message)
  
  //creates trex sprties
  trex = createSprite(displayWidth+50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  //create ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //makes gameover text and restat button sprites
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  gameOver.visible = false;
  restart.visible = false;
  
  //makes invisible ground sprite for collider reasons
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  //set trex collider and check the collider
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  //trex.debug = true
  
  //sets score to 0
  score = 0;
  
}

var index=0;
  var x=0;
  var y;
  var display_position = 130;

function draw() {
  //background color and creation
  background(255);
  //displaying score
  text("Score: "+ score, 500,50);
  console.log(trex.x);
  console.log(x);
  
  trex.position.x=displayWidth+50;
  //index=index+1;
    //x=x+200;
    //array[index-1].x=x;
    //array[index-1].y=y;
    
    camera.position.x=displayWidth/2-100
          //camera.position.y=array[index-1].y
    
  
  //play state
  if(gameState === PLAY){
    //makes the ground faster as the game progresses
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    //plays checkpoint sounds every 100 points
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    //makes ground "infinite"
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 160) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    //change state to end when cacti is touched
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
  //end state rules
   else if (gameState === END) {
     //make the gameover and restart button visible
     gameOver.visible = true;
     restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     //make restart button function
     if(mousePressedOver(restart)) {
      reset();
      }
     
      //stops movement
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);
     //stops movement
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  //draws sprites
  drawSprites();
}

function spawnObstacles(){
 //makes a random obstacle every 60 frames and makes them faster every 100 frames
  if (frameCount % 60 === 0){
   var obstacle = createSprite(displayWidth+20,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
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
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //makes clouds at a random y every 60 frames
  if (frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth+20,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
//reset function
function reset(){
  //makes gamestate play
  gameState=PLAY;
  //makes restart button and "GAME OVER" invisible 
  restart.visible=false;
  gameOver.visible=false;
  //destroys old cacti and clouds
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  //makes the trex have the running animation
  trex.changeAnimation("running",trex_running);
  //resets the score;
  score=0;

}