// Smooth scroll animation observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initNavigation();
    initVideoCarousel();
    initTimeline();
    initStoryModals();
    initLoadAnimation();
});

// Scroll Animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('animate-on-scroll');
        observer.observe(section);
    });
    
    // Stagger animation for cards
    const cards = document.querySelectorAll('.story-card, .project-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-on-scroll');
        observer.observe(card);
    });
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Active nav state on scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 100;
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                const section = document.querySelector(href);
                if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                        navLinks.forEach(l => l.style.fontWeight = '400');
                        link.style.fontWeight = '600';
                    }
                }
            }
        });
    });
}

// Video Carousel
function initVideoCarousel() {
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselDots = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const slides = document.querySelectorAll('.video-card');
    
    if (!carouselTrack || !slides.length) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        carouselDots.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.carousel-dot');
    
    function updateCarousel() {
        const offset = currentSlide * 100;
        carouselTrack.style.transform = `translateX(-${offset}%)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }
    
    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateCarousel();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        } else if (e.key === 'ArrowRight' && currentSlide < totalSlides - 1) {
            currentSlide++;
            updateCarousel();
        }
    });
    
    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentSlide < totalSlides - 1) {
                // Swipe left
                currentSlide++;
                updateCarousel();
            } else if (diff < 0 && currentSlide > 0) {
                // Swipe right
                currentSlide--;
                updateCarousel();
            }
        }
    }
}

// Interactive Timeline
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (!timelineItems.length) return;
    
    // Click to expand/collapse
    timelineItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all items
            timelineItems.forEach(ti => ti.classList.remove('active'));
            
            // Add active to clicked item
            item.classList.add('active');
            
            // Smooth scroll the timeline to center the active item
            const timeline = document.querySelector('.timeline-horizontal');
            const itemOffset = item.offsetLeft;
            const timelineCenter = timeline.offsetWidth / 2;
            const itemCenter = item.offsetWidth / 2;
            
            timeline.scrollTo({
                left: itemOffset - timelineCenter + itemCenter,
                behavior: 'smooth'
            });
        });
    });
    
    // Hover effects
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('active')) {
                item.style.transform = 'translateY(-5px)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('active')) {
                item.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Auto-expand first non-active item on scroll into view
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const firstActive = document.querySelector('.timeline-item.active');
                if (firstActive) {
                    const timeline = document.querySelector('.timeline-horizontal');
                    const itemOffset = firstActive.offsetLeft;
                    const timelineCenter = timeline.offsetWidth / 2;
                    const itemCenter = firstActive.offsetWidth / 2;
                    
                    setTimeout(() => {
                        timeline.scrollTo({
                            left: itemOffset - timelineCenter + itemCenter,
                            behavior: 'smooth'
                        });
                    }, 300);
                }
            }
        });
    }, { threshold: 0.3 });
    
    const educationSection = document.querySelector('.education-section');
    if (educationSection) {
        timelineObserver.observe(educationSection);
    }
}

// Parallax effect (subtle)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Parallax for hero if present
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroOverlay = hero.querySelector('.hero-overlay');
        if (heroOverlay) {
            const opacity = 0.5 + (scrolled / 1000) * 0.3;
            heroOverlay.style.background = `rgba(0, 0, 0, ${Math.min(opacity, 0.8)})`;
        }
    }
    
    // Parallax for project images
    const projectImages = document.querySelectorAll('.project-image img');
    projectImages.forEach((img, index) => {
        const rect = img.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const speed = 0.3 + (index % 3) * 0.1;
            const yPos = -(rect.top - window.innerHeight) * speed;
            img.style.transform = `translateY(${yPos}px) scale(1.05)`;
        }
    });
});

// Project card hover effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// Story card animations
document.querySelectorAll('.story-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.15}s`;
});

// Smooth reveal for project showcase
const showcaseObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 200);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.project-showcase-item, .project-featured').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    showcaseObserver.observe(item);
});

// Add loading animation
function initLoadAnimation() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
}

// Typing effect for code blocks (optional)
function typeCode(element) {
    const code = element.textContent;
    element.textContent = '';
    let i = 0;
    
    const typing = setInterval(() => {
        if (i < code.length) {
            element.textContent += code.charAt(i);
            i++;
        } else {
            clearInterval(typing);
        }
    }, 10);
}

// Initialize code typing when code block comes into view
const codeBlocks = document.querySelectorAll('.code-preview code');
const codeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.typed) {
            entry.target.dataset.typed = 'true';
            // Uncomment to enable typing effect
            // typeCode(entry.target);
        }
    });
}, { threshold: 0.5 });

codeBlocks.forEach(block => codeObserver.observe(block));

// Story Modal functionality
function initStoryModals() {
    const storyCards = document.querySelectorAll('.story-card[data-story]');
    const modal = document.getElementById('storyModal');
    const modalBody = document.getElementById('storyModalBody');
    const closeBtn = document.querySelector('.story-modal-close');
    const overlay = document.querySelector('.story-modal-overlay');
    
    // Story content database - you'll replace these with your own stories
    const stories = {
        'first-computer': {
            title: 'My First Computer',
            date: 'Childhood',
            icon: '🖥️',
            content: `
                <p>I was 8 years old when my mother brought home our first computer...</p>
                <p>[Your full story will go here. Write it in your own words, from your perspective as an 8-year-old experiencing this moment.]</p>
                <p>The fear I felt when I realized what I'd done was overwhelming, but the determination to fix it was stronger...</p>
                <p>[Continue your story...]</p>
            `
        },
        'vba-project': {
            title: 'VBA Examination Project',
            date: 'Grade 12',
            icon: '📊',
            content: `
                <p>My Grade 12 examination project was more than just an assignment...</p>
                <p>[Your full story about this project]</p>
            `
        },
        'internships': {
            title: 'Internships & Early Experience',
            date: 'University Years',
            icon: '💼',
            content: `
                <p>My internships taught me what I didn't want to build...</p>
                <p>[Your full story about internships]</p>
            `
        },
        'thesis': {
            title: 'Honours Mini Thesis',
            date: '2023',
            icon: '🎓',
            content: `
                <p>The thesis brought together everything I'd been learning...</p>
                <p>[Your full story about your thesis]</p>
            `
        },
        'hackathons': {
            title: 'Hackathons',
            date: 'Ongoing',
            icon: '⚡',
            content: `
                <p>Hackathons showed me the power of rapid prototyping...</p>
                <p>[Your full story about hackathons]</p>
            `
        }
    };
    
    function openModal(storyId) {
        const story = stories[storyId];
        if (!story) return;
        
        modalBody.innerHTML = `
            <h2><span style="font-size: 3rem; display: block; margin-bottom: 0.5rem;">${story.icon}</span>${story.title}</h2>
            <div class="story-meta">${story.date}</div>
            ${story.content}
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Click handlers
    storyCards.forEach(card => {
        card.addEventListener('click', () => {
            const storyId = card.dataset.story;
            openModal(storyId);
        });
    });
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Console easter egg
console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   Hi there! Thanks for checking out my portfolio.         ║
║                                                           ║
║   This site is a reflection of my learning journey       ║
║   and the systems I craft to enable sustainable          ║
║   wellbeing.                                              ║
║                                                           ║
║   Want to connect? Let's talk about curiosity,           ║
║   creativity, and building systems that heal.            ║
║                                                           ║
║   - Stefanie                                              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);
