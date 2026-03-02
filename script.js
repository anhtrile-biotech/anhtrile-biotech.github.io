const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// --- 1. Persistent Theme Toggle ---
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);
updateToggleIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleIcon(newTheme);
});

function updateToggleIcon(theme) {
    themeToggle.innerHTML = theme === 'dark' ? 
        '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

// --- 2. Performant Scroll Reveal ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});

// --- 3. Lightbox Logic ---
function openLightbox(src) {
    const modal = document.getElementById("certModal");
    const modalImg = document.getElementById("fullCertImage");
    modal.style.display = "block";
    modalImg.src = src;
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    const modal = document.getElementById("certModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") closeLightbox();
});

document.getElementById('certModal').addEventListener('click', function(event) {
    if (event.target === this) closeLightbox();
});

// --- UNIQUE FEATURE 1: Scroll Progress Bar ---
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("scroll-progress").style.width = scrolled + "%";
});

// --- UNIQUE FEATURE 2: Typewriter Effect ---
const bioTitles = [
    "Biotechnology Student", 
    "Genetics Enthusiast", 
    "Lab Researcher",
];
const typewriterElement = document.getElementById('typewriter');
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentTitle = bioTitles[titleIndex];

    if (isDeleting) {
        typewriterElement.innerHTML = currentTitle.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.innerHTML = currentTitle.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && charIndex === currentTitle.length) {
        typeSpeed = 2000; 
        isDeleting = true;
    } 
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % bioTitles.length;
        typeSpeed = 500; 
    }

    setTimeout(typeWriter, typeSpeed);
}

window.onload = typeWriter;

// --- UNIQUE FEATURE 3: Custom Project Slider ---
const track = document.getElementById('project-slider');
const slides = Array.from(track.children);
const nextButton = document.getElementById('slider-next');
const prevButton = document.getElementById('slider-prev');
const dotsContainer = document.getElementById('slider-dots');

let currentSlide = 0;

slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.dataset.index = index;
    dotsContainer.appendChild(dot);
});

const dots = Array.from(dotsContainer.children);

function updateSlider() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentSlide].classList.add('active');
}

nextButton.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length; 
    updateSlider();
});

prevButton.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length; 
    updateSlider();
});

dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
        currentSlide = parseInt(e.target.dataset.index);
        updateSlider();
    });
});

// --- UNIQUE FEATURE 4: Microscopic Random DNA Array ---
const canvas = document.createElement('canvas');
canvas.id = 'bio-canvas';
document.body.prepend(canvas);

canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';
// Set opacity around 60% as requested
canvas.style.opacity = '0.6'; 

const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class DNAStrand {
    constructor() {
        this.x = Math.random() * canvas.width; 
        this.y = Math.random() * canvas.height; 
        
        // Much smaller sizes
        this.length = Math.random() * 80 + 50; // Random length between 50-130px
        this.amplitude = Math.random() * 6 + 4; // Much narrower helix
        
        // Completely random directions (up, down, left, right)
        this.speedX = (Math.random() - 0.5) * 1.2; 
        this.speedY = (Math.random() - 0.5) * 1.2; 
        
        this.rotationSpeed = (Math.random() - 0.5) * 0.08; // Slightly faster twist for small DNA
        this.time = Math.random() * 100;
        
        // Random orientation angle from 0 to 360 degrees
        this.tiltAngle = Math.random() * Math.PI * 2; 
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.time += this.rotationSpeed;

        // Screen wrap: smoothly reappear on the opposite side if they float off screen
        if (this.x > canvas.width + this.length) this.x = -this.length;
        else if (this.x < -this.length) this.x = canvas.width + this.length;
        
        if (this.y > canvas.height + this.length) this.y = -this.length;
        else if (this.y < -this.length) this.y = canvas.height + this.length;

        this.draw();
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.tiltAngle);

        const spacing = 8; // Closer spacing for smaller strands
        const frequency = 0.12; // Tighter twists

        const backbone1Color = '#3498db'; 
        const backbone2Color = '#e67e22'; 
        const pairs = [
            ['#2980b9', '#c0392b'], 
            ['#f1c40f', '#8e44ad']  
        ];

        // 1. Draw the "BACK" half of the backbones first
        ctx.lineWidth = 2.5; // Thinner lines
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        for (let i = 0; i <= this.length; i += 2) {
            let phase = i * frequency + this.time;
            let x = Math.sin(phase) * this.amplitude;
            let z = Math.cos(phase); 
            let y = i - this.length / 2;
            if (z < 0) ctx.lineTo(x, y);
            else ctx.moveTo(x, y);
        }
        ctx.strokeStyle = backbone1Color;
        ctx.stroke();

        ctx.beginPath();
        for (let i = 0; i <= this.length; i += 2) {
            let phase = i * frequency + this.time + Math.PI;
            let x = Math.sin(phase) * this.amplitude;
            let z = Math.cos(phase);
            let y = i - this.length / 2;
            if (z < 0) ctx.lineTo(x, y);
            else ctx.moveTo(x, y);
        }
        ctx.strokeStyle = backbone2Color;
        ctx.stroke();

        // 2. Draw the Base Pairs
        ctx.lineWidth = 1.5; // Thinner base pairs
        for (let i = 0; i <= this.length; i += spacing) {
            let phase = i * frequency + this.time;
            let x1 = Math.sin(phase) * this.amplitude;
            let x2 = Math.sin(phase + Math.PI) * this.amplitude;
            let y = i - this.length / 2;
            
            let colorSet = pairs[(i / spacing) % 2 === 0 ? 0 : 1];

            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(0, y);
            ctx.strokeStyle = colorSet[0];
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(x2, y);
            ctx.strokeStyle = colorSet[1];
            ctx.stroke();
        }

        // 3. Draw the "FRONT" half of the backbones last
        ctx.lineWidth = 2.5;
        
        ctx.beginPath();
        for (let i = 0; i <= this.length; i += 2) {
            let phase = i * frequency + this.time;
            let x = Math.sin(phase) * this.amplitude;
            let z = Math.cos(phase);
            let y = i - this.length / 2;
            if (z >= 0) ctx.lineTo(x, y);
            else ctx.moveTo(x, y);
        }
        ctx.strokeStyle = backbone1Color;
        ctx.stroke();

        ctx.beginPath();
        for (let i = 0; i <= this.length; i += 2) {
            let phase = i * frequency + this.time + Math.PI;
            let x = Math.sin(phase) * this.amplitude;
            let z = Math.cos(phase);
            let y = i - this.length / 2;
            if (z >= 0) ctx.lineTo(x, y);
            else ctx.moveTo(x, y);
        }
        ctx.strokeStyle = backbone2Color;
        ctx.stroke();

        ctx.restore();
    }
}

let dnaArray = [];
// Draw 25 smaller strands floating randomly
for (let i = 0; i < 25; i++) {
    dnaArray.push(new DNAStrand());
}

// Animation Loop
function animateDNA() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dnaArray.forEach(dna => dna.update());
    requestAnimationFrame(animateDNA);
}
animateDNA();
