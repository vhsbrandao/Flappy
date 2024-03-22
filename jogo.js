console.log('Flappy Clubber by vhsbrandao')

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas')
const context = canvas.getContext("2d")

const flappyClubber = { // draw the bird
  spriteX: 0,
  spriteY: 0,
  largura: 33,
  altura: 24,
  positionX: 10,
  positionY: 50,
  draw() {
    context.drawImage( //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
      //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
          sprites, // drawn sprites
          flappyClubber.spriteX, flappyClubber.spriteY, // sprite position x and y
          flappyClubber.largura, flappyClubber.altura, //sprite size from the image
          flappyClubber.positionX, flappyClubber.positionY, // to draw sprite position on the screen
          flappyClubber.largura, flappyClubber.altura, // sprite size on the scren
    );
  }
}

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

const floor = {
  spriteX: 0, //sprite size to get in the source
  spriteY: 610, //sprite size to get in the source
  width: 724, // sprite size on the app screen
  height: 112, // sprite size on the app screen
  positionX: 0, // position on the app screen
  positionY: canvas.height - 112, //position on the app screen
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
      (floor.positionX), floor.positionY,
      floor.width, floor.height,
    );
  },
};



function loop() {
  background.draw();
  flappyClubber.draw();
  floor.draw();
  requestAnimationFrame(loop);
}

loop();
