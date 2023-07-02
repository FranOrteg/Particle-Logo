const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let AdjustX = 130;
let AdjustY = 100;

// handle mouse
let mouse = {
    x: null,
    y: null,
    radius: 100
};

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Create an image data
const image = new Image();
image.src = 'logo.png';

image.addEventListener('load', function () {
    canvas.width = 1000;
    canvas.height = 1000;
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, image.width, image.height);

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = 1.5;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 150) + 20;
            this.vibration = Math.random() * Math.PI * 2; // Valor aleatorio para la vibración
            this.vibrationSpeed = 0.05; // Velocidad de la vibración
        }

        draw() {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            // Vibración
            this.vibration += this.vibrationSpeed;

            // Movimiento en función de la vibración
            this.x = this.baseX + Math.cos(this.vibration) * 3;
            this.y = this.baseY + Math.sin(this.vibration) * 3;

            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 5;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 5;
                }
            }
        }
    }

    function init() {
        particleArray = [];
        const maxParticles = 3000; // Maximum number of particles
        const density = Math.ceil(imageData.data.length / (maxParticles * 4));

        for (let i = 0; i < imageData.data.length; i += density) {
            const alpha = imageData.data[i + 3];
            if (alpha > 128) {
                const pixelIndex = i / 4;
                const x = (pixelIndex % image.width) + AdjustX;
                const y = Math.floor(pixelIndex / image.width) + AdjustY;
                particleArray.push(new Particle(x, y));
                if (particleArray.length >= maxParticles) {
                    break;
                }
            }
        }
    }

    init();
    console.log(particleArray);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particleArray.length; i++) {
            particleArray[i].draw();
            particleArray[i].update();
        }
        requestAnimationFrame(animate);
    }

    animate();
});
