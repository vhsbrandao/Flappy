console.log('Flappy Clubber by github.com/vhsbrandao/')

const som_HIT = new Audio();
som_HIT.src = './effects/hit.wav';
const music = new Audio();
music.src = './effects/music.wav';

const sprites = new Image();
sprites.src = './sprites.png';
let frames = 0;

const canvas = document.querySelector('canvas')
const context = canvas.getContext("2d")

function colision(flappyClubber, floor) {
  const flappyClubberY = flappyClubber.positionY + flappyClubber.height;
  const floorY = floor.positionY

  if(flappyClubberY >= floorY) {
    som_HIT.play();
    music.pause();
    music.currentTime = 0;
    return true;
  }
  return false;
}



function CreateFlappyClubber() {
  const flappyClubber = { // draw the bird
    spriteX: 0,
    spriteY: 0,
    height: 33,
    width: 24,
    positionX: 10,
    positionY: 50,
    gravity: 0.25,
    speed: 0,
    heightjump: 4.6,

    jump(){
      flappyClubber.speed = - flappyClubber.heightjump
    },

    update(){
      if(colision(flappyClubber, globals.floor)) {
        som_HIT.play();
        music.pause();
        music.currentTime = 0;
          ChangeScreen(Screens.GAME_OVER);
        return;
      }
      flappyClubber.speed = flappyClubber.speed + flappyClubber.gravity;
      flappyClubber.positionY = flappyClubber.positionY + flappyClubber.speed;
    },

    movements: [
      { spriteX: 0, spriteY: 0, },
      { spriteX: 0, spriteY: 26, },
      { spriteX: 0, spriteY: 52, },
      { spriteX: 0, spriteY: 26, },
    ],
    ActualFrame: 0,

    updateFrame(){
      const gapFrames = 10;
      const frameControl = frames % gapFrames === 0;

     if(frameControl) {
      const movementRoot = 1;
      const increment = movementRoot + flappyClubber.ActualFrame;
      const repeatMovement = flappyClubber.movements.length;
      flappyClubber.ActualFrame = increment % repeatMovement
    }
    },

    draw() {
      flappyClubber.updateFrame();
      const { spriteX, spriteY } = flappyClubber.movements[flappyClubber.ActualFrame]
      context.drawImage(
        sprites,
        spriteX, spriteY,
        flappyClubber.height, flappyClubber.width,
        flappyClubber.positionX, flappyClubber.positionY,
        flappyClubber.height, flappyClubber.width,
      );

      context.drawImage(
        sprites,
        spriteX, spriteY,
        flappyClubber.height, flappyClubber.width,
        flappyClubber.positionX, flappyClubber.positionY,
        flappyClubber.height, flappyClubber.width,
      );
    }
  }
  return flappyClubber;
}

function createPipe() {

  const pipes = {
    width: 52,
    height:400,
    floor: {
      spriteX: 0,
      spriteY: 169,
    },
    sky: {
      spriteX: 52,
      spriteY: 169,
    },
    space: 100,

    draw() {
      pipes.pairs.forEach(function (pair) {
      const spaceBetween = 90;
      const yRandom = pair.y;


      // [PIPE SKY]
      const pipeSkyX = pair.x;
      const pipeSkyY = yRandom;

      context.drawImage(
        sprites,
        pipes.sky.spriteX, pipes.sky.spriteY,
        pipes.width, pipes.height,
        pipeSkyX, pipeSkyY,
        pipes.width, pipes.height,
      )
      // PIPE FLOOR
        const pipeFloorX = pair.x;
        const pipeFloorY = pipes.height + spaceBetween + yRandom;

        context.drawImage(
          sprites,
          pipes.floor.spriteX, pipes.floor.spriteY,
          pipes.width, pipes.height,
          pipeFloorX, pipeFloorY,
          pipes.width, pipes.height,
        )

      pair.pipeSky = {
        x: pipeSkyX,
        y: pipes.height + pipeSkyY
      }
      pair.pipeFloor = {
        x: pipeFloorX,
        y: pipeFloorY
      }
      })
    },

    hascCollision(pair) {

      const flappyHead = globals.flappyClubber.positionY;
      const flappyFoot = globals.flappyClubber.positionY + globals.flappyClubber.height;

      if ((globals.flappyClubber.positionX + globals.flappyClubber.width) >= pair.x) {
          if (flappyHead <= pair.pipeSky.y) {
              music.pause();
              music.currentTime = 0;
              ChangeScreen(Screens.GAME_OVER);
              return true;
          }

          if (flappyFoot >= (pair.pipeFloor.y + 10)) {
            music.pause();
              music.currentTime = 0;
            ChangeScreen(Screens.GAME_OVER);
              return true;
          }
      }
      return false;
      },


    pairs: [],

    update() {
      const passed100Frames = frames % 100 === 0;
      if (passed100Frames) {
        console.log('Passed 100 frames');
        pipes.pairs.push({
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }

      pipes.pairs.forEach(function (pair) {
        pair.x = pair.x - 2;

        if(pipes.hascCollision(pair))
        som_HIT.play();


        if (pair.x + pipes.width <= 0) {
          pipes.pairs.shift();
      }
      });
    }
  }

    return pipes;
}


// floor
function createFloor() {
  const floor = {
    spriteX: 0, //sprite size to get in the source
    spriteY: 610, //sprite size to get in the source
    width: 334, // sprite size on the app screen
    height: 112, // sprite size on the app screen
    positionX: 0, // position on the app screen
    positionY: canvas.height - 112, //position on the app screen

    update() {
      const moveFloor = 1;
      const repeatFLoor = floor.width;
      const move = floor.positionX - moveFloor;
      floor.positionX = move % repeatFLoor;
    },

    draw() {
      context.drawImage(
        sprites,
        floor.spriteX, floor.spriteY,
        floor.width, floor.height,
        floor.positionX, floor.positionY,
        floor.width, floor.height,
      );

      context.drawImage(
        sprites,
        floor.spriteX, floor.spriteY,
        floor.width, floor.height,
        (floor.positionX + floor.width), floor.positionY,
        floor.width, floor.height,
      );
    },
  };
  return floor;
};

const background = {
  spriteX: 390,
  spriteY: 0,
  width: 275,
  height: 204,
  positionX: 0,
  positionY: canvas.height - 204,
  draw() {
    context.fillStyle = '#000000';
    context.fillRect(0,0, canvas.width, canvas.height)

    context.drawImage(
      sprites,
      background.spriteX, background.spriteY,
      background.width, background.height,
      background.positionX, background.positionY,
      background.width, background.height,
    );

    context.drawImage(
      sprites,
      background.spriteX, background.spriteY,
      background.width, background.height,
      (background.positionX + background.width), background.positionY,
      background.width, background.height,
    );
  },
};

const msgGetReady = {
  spriteX: 134,
  spriteY: 0,
  height: 152,
  width: 224,
  positionX: (canvas.width / 2) - 174/2,
  positionY: 50,

  draw() {
    context.drawImage(
      sprites,
      msgGetReady.spriteX, msgGetReady.spriteY,
      msgGetReady.width, msgGetReady.height,
      msgGetReady.positionX, msgGetReady.positionY,
      msgGetReady.width, msgGetReady.height,
    );
  },
};

function createScore() {
  const score = {
    numbers: 0,
    show: 0,
    draw(){
      context.font = '35px "Tac One"';
      context.textAlign = 'right';
      context.fillStyle = 'white';
      context.fillText(`${score.numbers}`, canvas.width - 10, 35);
    },
    update(){
      const betweenFrames = 10
      const numb = frames % betweenFrames === 0;

      if(numb){
        score.numbers = score.numbers + 1
      }

    }
  }
    return score;
}

// [gameOverMessage]
const gameOverMessage = {
  sX: 134,
  sY: 153,
  w: 206,
  h: 100,
  x: (canvas.width / 2) - 226 / 2,
  y: (canvas.height / 2),
  draw() {
    context.drawImage(
      sprites,
      gameOverMessage.sX, gameOverMessage.sY,
      gameOverMessage.w, gameOverMessage.h,
      gameOverMessage.x, gameOverMessage.y,
      gameOverMessage.w, gameOverMessage.h
    );
  }
}


//TELAS
const globals = {};
let activeScreen = {};
function ChangeScreen(newScreen) {
  activeScreen = newScreen;
  activeScreen.inicialize && activeScreen.inicialize();
}

const Screens = {
  start: {
    inicialize(){
      globals.flappyClubber = CreateFlappyClubber();
      globals.pipes = createPipe();
      globals.floor = createFloor();
    },

    draw(){
      background.draw();
      globals.floor.draw();
      globals.flappyClubber.draw();
      msgGetReady.draw();
    },

    click(){
      ChangeScreen(Screens.jogo);
    },

    update(){
      globals.floor.update();
    }
  }
}

Screens.jogo = {

  inicialize(){
    globals.score = createScore();
  },

  draw(){
    background.draw();
    globals.flappyClubber.draw();
    globals.pipes.draw();
    globals.floor.draw();
    globals.score.draw();
  },

  click(){
    music.play();
    globals.flappyClubber.jump();
  },

  update(){
    globals.flappyClubber.update();
    globals.pipes.update();
    globals.floor.update();
    globals.score.update();
  }
}

Screens.GAME_OVER = {
  draw() {
    gameOverMessage.draw();
  },
  update() {

  },
  click() {
    ChangeScreen(Screens.start);
  }
}

function loop() {
  activeScreen.draw();
  activeScreen.update();
  frames = frames + 1;
  requestAnimationFrame(loop);
}

window.addEventListener('click', function () {
  activeScreen.click && activeScreen.click();
});

ChangeScreen(Screens.start);
loop();
