const canvas2 = document.getElementById('canvas2');
const ctx2 = canvas2.getContext('2d');
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;
let particleArray2 = [];
let AdjustX2 = 600;
let AdjustY2 = 280;

// handle mouse
let mouse2 = {
    x: null,
    y: null,
    radius: 50
}

window.addEventListener('mousemove', function (event) {
    mouse2.x = event.x;
    mouse2.y = event.y;
})

ctx2.font = '100px verdana';
ctx2.fillStyle = 'black';
ctx2.fillText('VisioTech', 0, 100);
/* ctx2.strokeStyle = 'black';
ctx2.strokeRect(0, 0, 100, 100); */
const TextCoordinates = ctx2.getImageData(0, 0, 600, 600);

class Particle2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 1.5;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 80) + 20;
        this.vibration = Math.random() * Math.PI * 2; // Valor aleatorio para la vibración
        this.vibrationSpeed = 0.05; // Velocidad de la vibración
    }
    draw() {
        ctx2.fillStyle = 'black';
        ctx2.beginPath();
        ctx2.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx2.closePath();
        ctx2.fill();
    }
    update() {
        // Vibración
        this.vibration += this.vibrationSpeed;

        // Movimiento en función de la vibración
        this.x = this.baseX + Math.cos(this.vibration) * 3;
        this.y = this.baseY + Math.sin(this.vibration) * 3;

        let dx2 = mouse2.x - this.x;
        let dy2 = mouse2.y - this.y;
        let distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        let forceDirection2X = dx2 / distance2;
        let forceDirection2Y = dy2 / distance2;
        let maxDistance2 = mouse2.radius;
        let force2 = (maxDistance2 - distance2) / maxDistance2;
        let directionX2 = forceDirection2X * force2 * this.density;
        let directionY2 = forceDirection2Y * force2 * this.density;
        if (distance2 < mouse2.radius) {
            this.x -= directionX2;
            this.y -= directionY2;
        } else {
            if (this.x !== this.baseX) {
                let dx2 = this.x - this.baseX;
                this.x -= dx2 / 2;
            }
            if (this.y !== this.baseY) {
                let dy2 = this.y - this.baseY;
                this.y -= dy2 / 2;
            }
        }
    }
}

function init2() {
    particleArray2 = [];
    const maxParticles2 = 10000;
    const density2 = Math.ceil(TextCoordinates.data.length / (maxParticles2 * 4));


    for (let i = 0; i < TextCoordinates.data.length; i += density2) {
        const alpha2 = TextCoordinates.data[i + 3];
        if (alpha2 > 128) {
            const pixelIndex2 = i / 4;
            const x2 = (pixelIndex2 % TextCoordinates.width) + AdjustX2;
            const y2 = Math.floor(pixelIndex2 / TextCoordinates.width) + AdjustY2;
            particleArray2.push(new Particle2(x2, y2));


            if (particleArray2.length >= maxParticles2) {
                break;
            }
        }
    }
}

init2();
console.log(particleArray2);

function animate2() {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    for (let i = 0; i < particleArray2.length; i++) {
        particleArray2[i].draw();
        particleArray2[i].update();
    }
    requestAnimationFrame(animate2);
}
animate2();
