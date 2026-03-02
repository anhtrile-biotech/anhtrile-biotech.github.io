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

// --- UNIQUE FEATURE 4: Abstract DNA Helix Background ---
const canvas = document.createElement('canvas');
canvas.id = 'bio-canvas';
document.body.prepend(canvas);

// Style the canvas to sit behind everything
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';
canvas.style.opacity = '0.4'; // Keep it subtle so text is readable

const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Class to generate floating DNA molecules
class DNAStrand {
    constructor() {
        this.x = Math.random() * canvas.width; // Random horizontal start
        this.y = Math.random() * canvas.height + canvas.height; // Start below screen
        this.length = Math.random() * 200 + 150; // Random length between 150-350px
        this.amplitude = Math.random() * 15 + 15; // Width of the helix
        this.speedY = Math.random() * -0.6 - 0.2; // Float up slowly
        this.rotationSpeed = (Math.random() - 0.5) * 0.04; // Twist speed
        this.time = Math.random() * 100;
        this.opacity = Math.random() * 0.4 + 0.2;
    }

    update() {
        this.y += this.speedY;
        this.time += this.rotationSpeed;

        // If the strand floats completely past the top of the screen, reset to bottom
        if (this.y < 0) {
            this.y = canvas.height + this.length;
            this.x = Math.random() * canvas.width;
        }
        this.draw();
    }

    draw() {
        const spacing = 15; // Distance between base pairs
        const frequency = 0.06; // How tight the twists are
        
        // Grab the current accent color from CSS
        const rootStyles = getComputedStyle(document.documentElement);
        const accentColor = rootStyles.getPropertyValue('--accent').trim() || '#10b981';
        
        ctx.fillStyle = accentColor;
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1.2;

        for (let i = 0; i < this.length; i += spacing) {
            const angle = i * frequency + this.time;
            
            // X coordinates for the two backbones
            const x1 = this.x + Math.sin(angle) * this.amplitude;
            const x2 = this.x + Math.sin(angle + Math.PI) * this.amplitude;
            const drawY = this.y - i; // Draw upwards from base Y

            // 3D Depth perception scale (makes dots look like they wrap around)
            const scale1 = Math.cos(angle) * 0.5 + 1;
            const scale2 = Math.cos(angle + Math.PI) * 0.5 + 1;

            // Draw connecting lines (Hydrogen bonds)
            ctx.globalAlpha = this.opacity * 0.3;
            ctx.beginPath();
            ctx.moveTo(x1, drawY);
            ctx.lineTo(x2, drawY);
            ctx.stroke();

            // Draw Nodes (Sugar/Phosphate backbone)
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(x1, drawY, 2 * scale1, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x2, drawY, 2 * scale2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

let dnaArray = [];
// Create enough strands based on screen width (not too crowded)
const numStrands = Math.max(4, Math.floor(window.innerWidth / 200)); 
for (let i = 0; i < numStrands; i++) {
    dnaArray.push(new DNAStrand());
}

// Animation Loop
function animateDNA() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dnaArray.forEach(dna => dna.update());
    requestAnimationFrame(animateDNA);
}
animateDNA();
