console.log('Flappy Clubber by github.com/vhsbrandao/')

const som_HIT = new Audio();
som_HIT.src = './effects/hit.wav';
const sprites = new Image();
sprites.src = './sprites.png';


const canvas = document.querySelector('canvas')
const context = canvas.getContext("2d")

function colision(flappyClubber, floor) {

  const flappyClubberY = flappyClubber.positionY + flappyClubber.height;
  const floorY = floor.positionY

  if(flappyClubberY >= floorY) {
      som_HIT.play();
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
    setTimeout(() => {
      ChangeScreen(Screens.start);
    }, 500);
    return;

   }
   flappyClubber.speed = flappyClubber.speed + flappyClubber.gravity;
   flappyClubber.positionY = flappyClubber.positionY + flappyClubber.speed;

},

  draw() {
    context.drawImage( //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
      //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
          sprites, // drawn sprites
          flappyClubber.spriteX, flappyClubber.spriteY, // sprite position x and y
          flappyClubber.height, flappyClubber.width, //sprite size from the image
          flappyClubber.positionX, flappyClubber.positionY, // to draw sprite position on the screen
          flappyClubber.height, flappyClubber.width, // sprite size on the scren
    );
  }
}
return flappyClubber;
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
    context.fillStyle = '#00000';
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
  draw(){
    background.draw();
    globals.flappyClubber.draw();
    globals.floor.draw();
  },

  click(){
    globals.flappyClubber.jump();
  },

  update(){
    globals.flappyClubber.update();
    globals.floor.update();
  }
}

function loop() {
  activeScreen.draw();
  activeScreen.update();
  requestAnimationFrame(loop);
}

window.addEventListener('click',function () {
  activeScreen.click && activeScreen.click();
}
  );

ChangeScreen(Screens.start);
loop();
