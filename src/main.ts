import './style.css'

class Circle {
  x: number;
  y: number;
  radius: number;
  velocityY: number;
  dampening: number;
  color: string;
  spawnRadius: number;
  currentSpawnTime: number;
  maxSpawnTime: number;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.radius = 1;
    this.velocityY = 0;
    this.dampening = 0.9;
    this.color = color;
    this.spawnRadius = Math.random() * 30 + 10; // Random spawn radius between 10 and 40
    this.currentSpawnTime = 0;
    this.maxSpawnTime = 500;
  }

  update(deltaTime: number) {
    if (this.currentSpawnTime < this.maxSpawnTime) {
      this.currentSpawnTime += deltaTime;
      this.radius = (this.currentSpawnTime / this.maxSpawnTime) * this.spawnRadius;
    } else {
      this.velocityY += 0.2 * deltaTime;
      this.y += this.velocityY;

      if (this.y + this.radius > canvas.height) {
        this.y = canvas.height - this.radius;
        this.velocityY *= -this.dampening;
      }
    }
  }

  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
  }
}

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const context = canvas.getContext('2d')!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
gradient.addColorStop(0, 'rgba(135, 206, 250, 0.5)');
gradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
context.fillStyle = gradient;
context.fillRect(0, 0, canvas.width, canvas.height);

const circles: Circle[] = [];

function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

canvas.addEventListener('click', (event) => {
  const randomColor = getRandomColor();
  const newCircle = new Circle(event.clientX, event.clientY, randomColor);
  circles.push(newCircle);
});

let lastTime = 0;
function tick(currentTime: number) {
  const deltaTime = currentTime - lastTime;

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  circles.forEach((circle) => {
    circle.update(deltaTime);
    circle.draw();
  });

  lastTime = currentTime;
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
