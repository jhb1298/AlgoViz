/**
 * Home Background Visualization: Neural Connect & Grow
 * A cinematic, interactive background for the MasterSuite dashboard.
 */

class Neuron {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.pulse = 0;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;

        this.pulse += this.pulseSpeed;
    }

    draw(ctx) {
        const currentAlpha = this.alpha + Math.sin(this.pulse) * 0.2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${currentAlpha})`;
        ctx.fill();
        
        // Glow effect
        if (Math.sin(this.pulse) > 0.8) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${currentAlpha * 0.3})`;
            ctx.fill();
        }
    }
}

class NeuralNetworkBG {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.neurons = [];
        this.maxDistance = 150;
        this.neuronCount = 60;
        
        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Adjust neuron count based on screen size
        this.neuronCount = Math.floor((this.canvas.width * this.canvas.height) / 25000);
        this.neuronCount = Math.min(Math.max(this.neuronCount, 40), 100);
        
        if (this.neurons.length > this.neuronCount) {
            this.neurons = this.neurons.slice(0, this.neuronCount);
        } else {
            while (this.neurons.length < this.neuronCount) {
                this.neurons.push(new Neuron(this.canvas));
            }
        }
    }

    init() {
        this.neurons = [];
        for (let i = 0; i < this.neuronCount; i++) {
            this.neurons.push(new Neuron(this.canvas));
        }
    }

    drawConnections() {
        for (let i = 0; i < this.neurons.length; i++) {
            for (let j = i + 1; j < this.neurons.length; j++) {
                const n1 = this.neurons[i];
                const n2 = this.neurons[j];
                const dist = Math.sqrt((n1.x - n2.x)**2 + (n1.y - n2.y)**2);

                if (dist < this.maxDistance) {
                    const opacity = (1 - dist / this.maxDistance) * 0.15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(n1.x, n1.y);
                    this.ctx.lineTo(n2.x, n2.y);
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();

                    // Pulse/Signal effect along some connections
                    if (dist < this.maxDistance * 0.6 && (i + j) % 7 === 0) {
                        const time = Date.now() * 0.001;
                        const progress = (time + (i * 0.1)) % 1;
                        const px = n1.x + (n2.x - n1.x) * progress;
                        const py = n1.y + (n2.y - n1.y) * progress;
                        
                        this.ctx.beginPath();
                        this.ctx.arc(px, py, 1.2, 0, Math.PI * 2);
                        this.ctx.fillStyle = `rgba(168, 85, 247, ${opacity * 4})`;
                        this.ctx.fill();
                    }
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawConnections();
        
        this.neurons.forEach(neuron => {
            neuron.update();
            neuron.draw(this.ctx);
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create canvas if it doesn't exist
    if (!document.getElementById('home-bg-canvas')) {
        const canvas = document.createElement('canvas');
        canvas.id = 'home-bg-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '0'; // Behind content but above body bg
        canvas.style.pointerEvents = 'none';
        canvas.style.opacity = '0.6';
        document.body.prepend(canvas);
    }
    
    new NeuralNetworkBG('home-bg-canvas');
});
