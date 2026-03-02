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

// --- UNIQUE FEATURE 4: Dual-Layer Bio Background ---
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
canvas.style.opacity = '0.5';

const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Layer 1: Large Ball-and-Stick Molecules
class BallAndStickMolecule {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.scale = Math.random() * 1.5 + 1.0; // Size multiplier
        
        // Very slow, random drift
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        
        // Slow rotation
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.005;
        
        this.alpha = Math.random() * 0.4 + 0.15; // Soft opacity
        
        this.nodes = [];
        this.edges = [];
        this.generateStructure();
    }

    generateStructure() {
        // Central atom
        this.nodes.push({x: 0, y: 0, r: 12});
        
        let numBranches = Math.floor(Math.random() * 3) + 3; // 3 to 5 main branches
        for(let i = 0; i < numBranches; i++) {
            let angle = (i / numBranches) * Math.PI * 2 + (Math.random() * 0.5 - 0.25);
            let dist = Math.random() * 40 + 30; // Distance from center
            let r = Math.random() * 6 + 6; // Atom size
            
            let nx = Math.cos(angle) * dist;
            let ny = Math.sin(angle) * dist;
            
            this.nodes.push({x: nx, y: ny, r: r});
            this.edges.push([0, this.nodes.length - 1]); // Connect to center
            
            // 60% chance for a secondary sub-branch connecting to this branch
            if (Math.random() > 0.4) {
                let subAngle = angle + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.8 + 0.5);
                let subDist = Math.random() * 30 + 20;
                let subR = Math.random() * 5 + 4;
                
                let sx = nx + Math.cos(subAngle) * subDist;
                let sy = ny + Math.sin(subAngle) * subDist;
                
                this.nodes.push({x: sx, y: sy, r: subR});
                this.edges.push([this.nodes.length - 2, this.nodes.length - 1]); // Connect to parent branch
            }
        }
    }

    update(color, bgColor) {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        // Screen wrap
        const wrapMargin = 150 * this.scale;
        if (this.x > canvas.width + wrapMargin) this.x = -wrapMargin;
        else if (this.x < -wrapMargin) this.x = canvas.width + wrapMargin;
        if (this.y > canvas.height + wrapMargin) this.y = -wrapMargin;
        else if (this.y < -wrapMargin) this.y = canvas.height + wrapMargin;

        this.draw(color, bgColor);
    }

    draw(color, bgColor) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        
        ctx.globalAlpha = this.alpha;
        
        // 1. Draw the bonds (lines)
        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
        ctx.beginPath();
        this.edges.forEach(edge => {
            const n1 = this.nodes[edge[0]];
            const n2 = this.nodes[edge[1]];
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
        });
        ctx.stroke();

        // 2. Draw the atoms (circles filled with background color so lines don't show through)
        ctx.lineWidth = 2.5;
        this.nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
            ctx.fillStyle = bgColor; // Hide bonds underneath
            ctx.fill();
            ctx.strokeStyle = color; // Outline atom
            ctx.stroke();
        });

        ctx.restore();
    }
}

// Layer 2: Monochrome DNA Strands (Horizontal/Vertical)
class DNAStrand {
    constructor() {
        this.x = Math.random() * canvas.width; 
        this.y = Math.random() * canvas.height; 
        
        this.length = Math.random() * 100 + 80; 
        this.amplitude = Math.random() * 8 + 5; 
        
        this.isVertical = Math.random() > 0.5;
        this.tiltAngle = this.isVertical ? 0 : Math.PI / 2;
        
        let moveSpeed = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.15 + 0.05);
        
        this.speedX = this.isVertical ? 0 : moveSpeed;
        this.speedY = this.isVertical ? moveSpeed : 0;
        
        this.rotationSpeed = (Math.random() > 0.5 ? 1 : -1) * 0.02; 
        this.time = Math.random() * 100;
    }

    update(color) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.time += this.rotationSpeed;

        if (this.speedX > 0 && this.x > canvas.width + this.length) this.x = -this.length;
        else if (this.speedX < 0 && this.x < -this.length) this.x = canvas.width + this.length;
        
        if (this.speedY > 0 && this.y > canvas.height + this.length) this.y = -this.length;
        else if (this.speedY < 0 && this.y < -this.length) this.y = canvas.height + this.length;

        this.draw(color);
    }

    draw(color) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.tiltAngle);

        const spacing = 8; 
        const frequency = 0.1; 
        ctx.strokeStyle = color;

        // 1. Draw "BACK" half
        ctx.lineWidth = 2; 
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
        ctx.stroke();

        // 2. Draw Base Pairs 
        ctx.lineWidth = 1; 
        for (let i = 0; i <= this.length; i += spacing) {
            let phase = i * frequency + this.time;
            let x1 = Math.sin(phase) * this.amplitude;
            let x2 = Math.sin(phase + Math.PI) * this.amplitude;
            let y = i - this.length / 2;

            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.stroke();
        }

        // 3. Draw "FRONT" half
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= this.length; i += 2) {
            let phase = i * frequency + this.time;
            let x = Math.sin(phase) * this.amplitude;
            let z = Math.cos(phase);
            let y = i - this.length / 2;
            if (z >= 0) ctx.lineTo(x, y);
            else ctx.moveTo(x, y);
        }
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
        ctx.stroke();

        ctx.restore();
    }
}

// Initialize Arrays
let dnaArray = [];
let moleculesArray = [];

// Create 3 minimalist DNA strands
for (let i = 0; i < 3; i++) {
    dnaArray.push(new DNAStrand());
}

// Create 6 large Ball-and-Stick molecules
for (let i = 0; i < 6; i++) {
    moleculesArray.push(new BallAndStickMolecule());
}

// Animation Loop
function animateBioCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fetch colors dynamically so the hollow atoms blend perfectly
    const rootStyles = getComputedStyle(document.documentElement);
    const themeColor = rootStyles.getPropertyValue('--text').trim() || '#ffffff';
    const bgColor = rootStyles.getPropertyValue('--bg').trim() || '#0b1121';

    // Draw molecules first
    moleculesArray.forEach(mol => mol.update(themeColor, bgColor));
    
    // Draw DNA on top
    dnaArray.forEach(dna => dna.update(themeColor));

    requestAnimationFrame(animateBioCanvas);
}
animateBioCanvas();
