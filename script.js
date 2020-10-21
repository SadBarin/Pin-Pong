//Игровые параметры
const canvas       =  document.getElementById('field');
const ctx          =  canvas.getContext('2d');
const grid         =  15;
const paddleHeight =  grid * 5; //80
const maxPaddleY   =  canvas.height - grid - paddleHeight;

let paddleSpeed    =  6;
let ballSpeed      =  5;

let leftPaddleScore  = 0;
let rightPaddleScore = 0;
let ballAbroadScore       = 0;

//Платформы и мяч
const leftPaddle = {
  x:       grid * 2,
  y:       canvas.height / 2 - paddleHeight / 2,
  width:   grid,
  height:  paddleHeight,
  dy:      0
};

const rightPaddle = {
  x:       canvas.width - grid * 3,
  y:       canvas.height / 2 - paddleHeight /2,
  width:   grid,
  height:  paddleHeight,
  dy:      0       
};

const ball = {
  x:          canvas.width / 2,
  y:          canvas.height / 2,
  width:      grid,
  height:     grid,
  resseting:  false,
  dx:         ballSpeed,
  dy:         -ballSpeed
};

//Проверка на пересечение двух объектов
function collides(obj1, obj2) {
  return  obj1.x < obj2.x + obj2.width &&
          obj1.x + obj1.width > obj2.x &&
          obj1.y < obj2.y + obj2.height &&
          obj1.y + obj1.height > obj2.y;
};

//Основной цикл игры
function loop() {
  requestAnimationFrame(loop);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  
  //Физика платформ
  leftPaddle.y  += leftPaddle.dy;
  rightPaddle.y += rightPaddle.dy;

  if (leftPaddle.y < grid) {
    leftPaddle.y = grid;
  }
  else if (leftPaddle.y > maxPaddleY) {
    leftPaddle.y = maxPaddleY;
  }

  if (rightPaddle.y < grid) {
    rightPaddle.y = grid;
  }
  else if (rightPaddle.y > maxPaddleY) {
    rightPaddle.y = maxPaddleY;
  }

  //Физика мяча
  ball.x += ball.dx;
  ball.y += ball.dy;

  if(ball.y < grid){
    ball.y  = grid;
    ball.dy *= -1;
  }
  else if(ball.y + grid > canvas.height - grid){
    ball.y   = canvas.height - grid * 2;
    ball.dy *= -1;
  }

  if ( (ball.x < 0 || ball.x > canvas.width) && !ball.resetting) {
    ball.resetting = true;

    setTimeout(() => {
      ball.resetting = false;
      ball.x         = canvas.width / 2;
      ball.y         = canvas.height / 2;
    }, 3000);

    ballAbroadScore += 1;
    console.warn('Мяч улетел!')
    console.log(`Мяч вылетел за границу: ${ballAbroadScore} раз`)
  }

  if (collides(ball, leftPaddle)){
    ball.dx *= -1;
    ball.x   = leftPaddle.x + leftPaddle.width;

    leftPaddleScore += 1;
    console.log(`Левая Платформа: ${leftPaddleScore}`);
  }
  else if (collides(ball, rightPaddle)){
    ball.dx *= -1;
    ball.x   = rightPaddle.x - ball.width;

    rightPaddleScore += 1;
    console.log(`Правая Платформа: ${rightPaddleScore}`);
  }

  //Рисуем объекты
  ctx.fillStyle = 'white';
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

  ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
  ctx.fillStyle = 'lightgrey';
  ctx.fillRect(0, 0, canvas.width, grid);
  ctx.fillRect(0, canvas.height - grid, canvas.width, canvas.height);

  for (let i = grid; i < canvas.height - grid; i += grid * 2) {
    ctx.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
  }

  ctx.fillStyle = "lightgrey";
  ctx.strokeStyle = "#F00";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText(`Первый игрок: ${leftPaddleScore}`, 20, 50);

  ctx.fillStyle = "lightgrey";
  ctx.strokeStyle = "#F00";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText(`Второй игрок: ${rightPaddleScore}`, 500, 50)


  //Управление
  document.addEventListener('keydown', function(e) {
    //Низ
    if (e.which === 38) {
      rightPaddle.dy = -paddleSpeed;
    }
    //Вверх
    else if (e.which === 40) {
      rightPaddle.dy = paddleSpeed;
    }
    
    //W
    if (e.which === 87) {
      leftPaddle.dy = -paddleSpeed;
    }
    //S
    else if (e.which === 83) {
      leftPaddle.dy = paddleSpeed;
    }
  });
  
  document.addEventListener('keyup', function(e) {
    if (e.which === 38 || e.which === 40) {
      rightPaddle.dy = 0;
    }
    if (e.which === 83 || e.which === 87) {
      leftPaddle.dy = 0;
    }
  });
};

//Запуск игры
requestAnimationFrame(loop);