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

// --- UNIQUE FEATURE 4: Dual-Layer Bio Background (Small Complex Molecules + DNA) ---
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
canvas.style.opacity = '0.5'; // Base canvas opacity

const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Layer 1: Ball-and-Stick Molecules (Now smaller!)
class BallAndStickMolecule {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        // REDUCED SIZE: Scales are much smaller now
        this.scale = Math.random() * 0.6 + 0.4; // Previously 1.0 to 2.5
        this.baseSize = Math.random() * 30 + 30; // Previously 80 to 120
        
        // Very slow, random drift
        this.vx = (Math.random() - 0.5) * 0.15;
        this.vy = (Math.random() - 0.5) * 0.15;
        
        // Slow rotation as a single unit
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.005;
        
        // Faint, varied opacity
        this.alpha = Math.random() * 0.3 + 0.1;
        
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
        const maxRadius = this.baseSize * 1.5 * this.scale;
        if (this.x > canvas.width + maxRadius) this.x = -maxRadius;
        else if (this.x < -maxRadius) this.x = canvas.width + maxRadius;
        if (this.y > canvas.height + maxRadius) this.y = -maxRadius;
        else if (this.y < -maxRadius) this.y = canvas.height + maxRadius;

        this.draw(color, bgColor);
    }

    draw(color, bgColor) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        
        ctx.globalAlpha = this.alpha;
        
        // --- DRAW COMPLEX SHAPE ---
        const ringRadius = this.baseSize * 0.35;
        const mainAtomRadius = this.baseSize * 0.14; 
        const chainAtomRadius = this.baseSize * 0.08;

        ctx.lineWidth = 1.5 * (this.baseSize / 50); // Adjusted line width for smaller sizes
        ctx.strokeStyle = color;
        ctx.fillStyle = bgColor; // Fill with background color to hide overlapping bonds

        // Draw Central Ring (6 atoms)
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 * i) / 6;
            const ax = Math.cos(angle) * ringRadius;
            const ay = Math.sin(angle) * ringRadius;

            // Draw connecting chains first so they sit behind the atoms visually
            if (i === 0) {
                const cx1 = ax + Math.cos(angle - Math.PI / 4) * (ringRadius * 0.8);
                const cy1 = ay + Math.sin(angle - Math.PI / 4) * (ringRadius * 0.8);
                ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(cx1, cy1); ctx.stroke();
                ctx.beginPath(); ctx.arc(cx1, cy1, chainAtomRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            }
            if (i === 1) {
                const cx2 = ax + Math.cos(angle - Math.PI / 3) * (ringRadius * 0.7);
                const cy2 = ay + Math.sin(angle - Math.PI / 3) * (ringRadius * 0.7);
                ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(cx2, cy2); ctx.stroke();
                ctx.beginPath(); ctx.arc(cx2, cy2, chainAtomRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            }
            if (i === 2) {
                const cx3 = ax + Math.cos(angle - Math.PI / 2) * (ringRadius * 0.6);
                const cy3 = ay + Math.sin(angle - Math.PI / 2) * (ringRadius * 0.6);
                ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(cx3, cy3); ctx.stroke();
                ctx.beginPath(); ctx.arc(cx3, cy3, chainAtomRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            }
            if (i === 3) {
                const cx4 = ax + Math.cos(angle - Math.PI / 1.5) * (ringRadius * 0.5);
                const cy4 = ay + Math.sin(angle - Math.PI / 1.5) * (ringRadius * 0.5);
                ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(cx4, cy4); ctx.stroke();
                ctx.beginPath(); ctx.arc(cx4, cy4, chainAtomRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            }
            if (i === 4) {
                const cx5 = ax + Math.cos(angle - Math.PI / 1.2) * (ringRadius * 0.4);
                const cy5 = ay + Math.sin(angle - Math.PI / 1.2) * (ringRadius * 0.4);
                ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(cx5, cy5); ctx.stroke();
                ctx.beginPath(); ctx.arc(cx5, cy5, chainAtomRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            }

            // Connect Atoms in Ring
            const nextAngle = (Math.PI * 2 * (i + 1)) / 6;
            const nax = Math.cos(nextAngle) * ringRadius;
            const nay = Math.sin(nextAngle) * ringRadius;
            ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(nax, nay); ctx.stroke();

            // Draw Main Ring Atom last so it overlaps the bond lines
            ctx.beginPath();
            ctx.arc(ax, ay, mainAtomRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }

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
let complexMoleculesArray = [];

// Create 3 minimalist DNA strands
for (let i = 0; i < 3; i++) {
    dnaArray.push(new DNAStrand());
}

// Create 8 smaller Ball-and-Stick molecules (increased count slightly since they are smaller)
for (let i = 0; i < 8; i++) {
    complexMoleculesArray.push(new BallAndStickMolecule());
}

// Animation Loop
function animateBioCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fetch colors dynamically so the hollow atoms blend perfectly
    const rootStyles = getComputedStyle(document.documentElement);
    const themeColor = rootStyles.getPropertyValue('--text').trim() || '#ffffff';
    const bgColor = rootStyles.getPropertyValue('--bg').trim() || '#0b1121';

    // Draw molecules first
    complexMoleculesArray.forEach(mol => mol.update(themeColor, bgColor));
    
    // Draw DNA on top
    dnaArray.forEach(dna => dna.update(themeColor));

    requestAnimationFrame(animateBioCanvas);
}
animateBioCanvas();
