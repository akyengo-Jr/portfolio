// ==================== GOOGLE ANALYTICS ====================
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-1CDW5R4K6X');

// ====================  CAROUSEL ====================
(function() {
    'use strict';
    
    // Image configuration - update this when you add new screenshots
    const PROJECT_IMAGES = {
        'life-expectancy': [
            'assets/img/life_expectancy/7.png',
            'assets/img/life_expectancy/6.png',
            'assets/img/life_expectancy/5.png',
            'assets/img/life_expectancy/4.png'
        ],
        'streamlit-deployment': [
            'assets/img/streamlit-deployment/1.jpg',
            'assets/img/streamlit-deployment/2.jpg',
            'assets/img/streamlit-deployment/3.jpg'
        ]
    };
    
    // Lazy load images when they're about to be seen
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    }, { rootMargin: '50px', threshold: 0.01 });
    
    // Only initialize carousels when they're about to be seen
    const carouselObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;
                if (!container._initialized) {
                    initCarousel(container);
                    container._initialized = true;
                }
                carouselObserver.unobserve(container);
            }
        });
    }, { rootMargin: '200px', threshold: 0 });
    
    function initCarousel(container) {
        const track = container.querySelector('.carousel-track');
        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');
        const dotsContainer = container.querySelector('.carousel-dots');
        
        // Get project name from parent article
        const projectCard = container.closest('.project-card');
        const projectName = projectCard?.dataset.project;
        
        if (!projectName || !PROJECT_IMAGES[projectName]) return;
        
        const images = PROJECT_IMAGES[projectName];
        if (images.length === 0) return;
        
        let currentIndex = 0;
        let isTransitioning = false;
        
        // Create slides
        const fragment = document.createDocumentFragment();
        images.forEach((src, i) => {
            const img = document.createElement('img');
            img.className = 'carousel-slide';
            img.alt = `${projectName} screenshot ${i + 1}`;
            img.loading = 'lazy';
            img.dataset.src = src;
            img.style.background = '#f0f0f0';
            fragment.appendChild(img);
        });
        
        // Clear and append
        track.innerHTML = '';
        track.appendChild(fragment);
        
        // Observe images
        track.querySelectorAll('.carousel-slide').forEach(img => imageObserver.observe(img));
        
        // Create counter
        const counter = document.createElement('span');
        counter.className = 'carousel-counter';
        counter.textContent = `1/${images.length}`;
        container.appendChild(counter);
        
        // Create dots
        const dotsFragment = document.createDocumentFragment();
        for (let i = 0; i < images.length; i++) {
            const dot = document.createElement('span');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.dataset.index = i;
            dotsFragment.appendChild(dot);
        }
        dotsContainer.innerHTML = '';
        dotsContainer.appendChild(dotsFragment);
        
        // Hide buttons if only one image
        if (images.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
        
        // Event handlers
        function moveSlide(direction) {
            if (isTransitioning || images.length <= 1) return;
            isTransitioning = true;
            
            currentIndex = (currentIndex + direction + images.length) % images.length;
            
            requestAnimationFrame(() => {
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                // Update dots
                const dots = dotsContainer.children;
                for (let i = 0; i < dots.length; i++) {
                    dots[i].classList.toggle('active', i === currentIndex);
                }
                
                counter.textContent = `${currentIndex + 1}/${images.length}`;
                
                setTimeout(() => { isTransitioning = false; }, 300);
            });
        }
        
        function goToSlide(e) {
            if (!e.target.classList.contains('carousel-dot') || isTransitioning) return;
            const index = parseInt(e.target.dataset.index, 10);
            if (index === currentIndex) return;
            
            isTransitioning = true;
            currentIndex = index;
            
            requestAnimationFrame(() => {
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                const dots = dotsContainer.children;
                for (let i = 0; i < dots.length; i++) {
                    dots[i].classList.toggle('active', i === currentIndex);
                }
                
                counter.textContent = `${currentIndex + 1}/${images.length}`;
                
                setTimeout(() => { isTransitioning = false; }, 300);
            });
        }
        
        // Add listeners
        prevBtn.addEventListener('click', () => moveSlide(-1));
        nextBtn.addEventListener('click', () => moveSlide(1));
        dotsContainer.addEventListener('click', goToSlide);
        
        // Keyboard navigation
        container.setAttribute('tabindex', '0');
        container.addEventListener('keydown', (e) => {
            if (document.activeElement !== container) return;
            if (e.key === 'ArrowLeft') { e.preventDefault(); moveSlide(-1); }
            if (e.key === 'ArrowRight') { e.preventDefault(); moveSlide(1); }
        });
        
        // Touch support
        let touchStartX = 0;
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            if (!touchStartX) return;
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) moveSlide(diff > 0 ? 1 : -1);
            touchStartX = 0;
        }, { passive: true });
    }
    
    // ==================== SCROLL REVEAL ====================
    function initScrollReveal() {
        if (typeof ScrollReveal !== 'undefined') {
            ScrollReveal().reveal('.reveal', { 
                delay: 200, 
                distance: '30px', 
                origin: 'bottom', 
                duration: 1000, 
                easing: 'cubic-bezier(0.5, 0, 0, 1)' 
            });
            ScrollReveal().reveal('.reveal-top', { 
                delay: 100, 
                distance: '20px', 
                origin: 'top' 
            });
            ScrollReveal().reveal('.reveal-left', { 
                delay: 300, 
                distance: '40px', 
                origin: 'left' 
            });
            ScrollReveal().reveal('.reveal-bottom', { 
                delay: 500, 
                distance: '20px', 
                origin: 'bottom' 
            });
        }
    }
    
    // ==================== INITIALIZE EVERYTHING ====================
    document.addEventListener('DOMContentLoaded', () => {
        // Start carousel observers
        document.querySelectorAll('.carousel-container').forEach(container => {
            carouselObserver.observe(container);
        });
        
        // Initialize scroll reveal
        initScrollReveal();
    });
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        carouselObserver.disconnect();
        imageObserver.disconnect();
    });
    
})();