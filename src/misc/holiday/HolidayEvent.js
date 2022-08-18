import './HolidayEvent.css';

// https://www.base64-image.de/

export default function HolidayEvent(type) {
	if (!type) return;
	
	console.log(`Holiday Event: ${type}`);
	
	const manager = new Manager(TYPE_TO_CONFIG[type]);
};

const TYPE_TO_CONFIG = {
	halloween_bat: {
		class: 'halloween_bat',
		
		delayMin: 60000,
		delayMax: 120000,
		// delayMin: 2000,
		// delayMax: 2000,
		lifespan: 6 * 60, // uses anim frames
		burst: 20,
		doOnMove: false,
		
		
		VelocityInitial: () => ({
			x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 2),
			y: (-2.5 + (Math.random() * -1))
		}),
		VelocityUpdater: (part) => {
			part.velocity.x += (Math.random() < 0.5 ? -1 : 1) * 2 / 75;
			part.velocity.y -= Math.random() / 600;
		},
		CalculateScale: (currentLifetime, maxLifetime) => {
			return (1 - (currentLifetime / maxLifetime)) + 0.5;
		},
	},
	
	halloween_spider: {
		class: 'halloween_spider',
		
		delayMin: 60000,
		delayMax: 120000,
		// delayMin: 2000,
		// delayMax: 2000,
		lifespan: 6 * 60, // uses anim frames
		burst: 12,
		doOnMove: false,
		
		VelocityInitial: () => ({
			x: (Math.random() < 0.5 ? -1 : 1) * ((Math.random() * 5) + 2),
			y: (Math.random() < 0.5 ? -1 : 1) * ((Math.random() * 5) + 2),
		}),
		VelocityUpdater: (part) => {
			// part.velocity.x += (Math.random() < 0.5 ? -1 : 1) * 2 / 75;
			// part.velocity.y -= Math.random() / 600;
		},
		CalculateScale: (currentLifetime, maxLifetime) => {
			return 1;
		},
	},
};

class Manager {
	
	config;
	particleClass;
	rootElement;
	width;
	height;
	cursor = {};
	particles = [];
	canBurst = false;
	
	constructor(config) {
		this.config = config;
		this.particleClass = config.class;
		
		this.rootElement = document.createElement('div');
		this.rootElement.className = 'holiday_root';
		document.body.appendChild(this.rootElement);
		
		this.SetNextBurst();
		
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.cursor = {x: this.width / 2, y: this.height / 2};
		document.addEventListener('mousemove', this.OnMouseMove);
		window.addEventListener('resize', this.OnWindowResize);
		
		window.requestAnimationFrame(this.Loop);
	}
	
	OnMouseMove = e => {
		this.cursor.x = e.clientX;
		this.cursor.y = e.clientY;
		
		if (this.canBurst) {
			this.Burst();
		}
		
		if (this.config.doOnMove) this.AddParticle(this.cursor.x, this.cursor.y);
	};
	
	OnWindowResize = e => {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
	};
	
	AddParticle = (x, y) => {
		const part = this.Create(x, y, this.particleClass);
		this.particles.push(part);
		this.rootElement.appendChild(part.element);
	};
	
	Burst = () => {
		this.canBurst = false;
		for (let i = 0; i < this.config.burst; i++) {
			this.AddParticle(this.cursor.x, this.cursor.y);
		}
		this.SetNextBurst();
	};
	
	Loop = () => {
		for (let i = 0; i < this.particles.length; i++) {
			this.Update(this.particles[i]);
		}
		
		for (let i = this.particles.length - 1; i >= 0; i--) {
			if (this.particles[i].lifespan < 0
				|| this.particles[i].position.x >= this.width - 50
				|| this.particles[i].position.y >= this.height - 50) {
				this.Die(this.particles[i]);
				this.particles.splice(i, 1);
			}
		}
		
		window.requestAnimationFrame(this.Loop);
	};
	
	Create = (x, y, particleClass) => {
		const part = new Particle();
		
		part.lifespan = this.config.lifespan;
		
		part.velocity = this.config.VelocityInitial();
		
		part.position = {x: x - 15, y: y - 15};
		
		part.element = document.createElement('span');
		part.element.className = particleClass;
		this.Update(part);
		
		return part;
	};
	
	Update = (part) => {
		part.position.x += part.velocity.x;
		part.position.y += part.velocity.y;
		this.config.VelocityUpdater(part);
		part.lifespan--;
		
		part.scale = this.config.CalculateScale(part.lifespan, this.config.lifespan);
		
		part.element.style.transform = `translate3d(${part.position.x}px,${part.position.y}px,0) scale(${part.scale})`;
	};
	
	Die = (part) => {
		part.element.parentNode.removeChild(part.element);
	};
	
	SetNextBurst = () => {
		setTimeout(() => {
			this.canBurst = true;
		}, Math.random() * (this.config.delayMax - this.config.delayMin) + this.config.delayMin);
	};
}

class Particle {
	lifespan;
	element;
	position;
	velocity;
	scale;
}