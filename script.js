// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Navigation smooth scrolling
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80; // Account for sticky nav
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Add staggered animation for day cards
                if (entry.target.classList.contains('day-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    entry.target.style.animationDelay = delay + 'ms';
                }
                
                // Add staggered animation for highlight cards
                if (entry.target.classList.contains('highlight-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 150;
                    entry.target.style.animationDelay = delay + 'ms';
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.day-card, .highlight-card, .tip-card, .stat-item');
    animatedElements.forEach(el => observer.observe(el));

    // Parallax effect for hero section
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-bg');
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.5;
            element.style.transform = `translateY(${rate}px)`;
        });
        
        ticking = false;
    }
    
    function requestParallaxUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestParallaxUpdate);

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavOnScroll() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavOnScroll);

    // Add click animations
    const clickableElements = document.querySelectorAll('.day-card, .highlight-card, .tip-card, .restaurant-card, .photo-spot');
    
    clickableElements.forEach(element => {
        element.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Collapsible detailed sections
    function initializeCollapsibleSections() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach(item => {
            const subDetails = item.querySelector('.sub-details');
            if (subDetails) {
                // Create toggle button
                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'details-toggle';
                toggleBtn.innerHTML = '<span class="toggle-icon">▼</span>';
                toggleBtn.setAttribute('aria-expanded', 'true');
                
                // Insert button
                const timelineDesc = item.querySelector('.timeline-desc strong');
                if (timelineDesc) {
                    timelineDesc.appendChild(toggleBtn);
                }
                
                // Add toggle functionality
                toggleBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const isExpanded = this.getAttribute('aria-expanded') === 'true';
                    const icon = this.querySelector('.toggle-icon');
                    
                    if (isExpanded) {
                        subDetails.style.display = 'none';
                        icon.textContent = '▶';
                        this.setAttribute('aria-expanded', 'false');
                    } else {
                        subDetails.style.display = 'block';
                        icon.textContent = '▼';
                        this.setAttribute('aria-expanded', 'true');
                    }
                });
            }
        });
    }

    // Photo spot interaction
    function initializePhotoSpots() {
        const photoSpots = document.querySelectorAll('.photo-spot');
        
        photoSpots.forEach(spot => {
            spot.addEventListener('click', function() {
                // Add clicked effect
                this.classList.add('spot-clicked');
                setTimeout(() => {
                    this.classList.remove('spot-clicked');
                }, 300);
                
                // Could add GPS copying functionality here
                const gpsLocation = this.querySelector('.gps-location');
                if (gpsLocation) {
                    // Copy GPS coordinates to clipboard if available
                    const gpsText = gpsLocation.textContent.replace('📍 GPS: ', '');
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(gpsText).then(() => {
                            showToast('GPS坐标已复制到剪贴板');
                        });
                    }
                }
            });
        });
    }

    // Restaurant card interaction
    function initializeRestaurantCards() {
        const restaurantCards = document.querySelectorAll('.restaurant-card');
        
        restaurantCards.forEach(card => {
            card.addEventListener('click', function() {
                const address = this.querySelector('.restaurant-address').textContent;
                // Could integrate with map services
                console.log('Restaurant address:', address);
                
                // Add visual feedback
                this.classList.add('restaurant-selected');
                setTimeout(() => {
                    this.classList.remove('restaurant-selected');
                }, 500);
            });
        });
    }

    // Budget calculator
    function initializeBudgetCalculator() {
        const budgetSections = document.querySelectorAll('.budget-today');
        
        budgetSections.forEach(section => {
            const budgetLines = section.querySelectorAll('.budget-line');
            let total = 0;
            
            budgetLines.forEach(line => {
                const amountText = line.querySelector('span:last-child').textContent;
                const amounts = amountText.match(/(\d+)-?(\d+)?/);
                if (amounts) {
                    const minAmount = parseInt(amounts[1]);
                    const maxAmount = amounts[2] ? parseInt(amounts[2]) : minAmount;
                    total += (minAmount + maxAmount) / 2; // Use average
                }
            });
            
            // Add interactive total display
            const totalElement = section.querySelector('.budget-total strong');
            if (totalElement) {
                totalElement.addEventListener('click', function() {
                    showToast(`平均预算：${Math.round(total)}元`);
                });
            }
        });
    }

    // Toast notification system
    function showToast(message) {
        // Create toast if it doesn't exist
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.classList.add('toast-show');
        
        setTimeout(() => {
            toast.classList.remove('toast-show');
        }, 3000);
    }

    // Weather display enhancement
    function enhanceWeatherDisplay() {
        const weatherInfos = document.querySelectorAll('.weather-info');
        
        weatherInfos.forEach(info => {
            info.addEventListener('click', function() {
                const temp = this.querySelector('span:last-child').textContent;
                showToast(`今日温度：${temp}，请注意保暖`);
            });
        });
    }

    // Route overview interaction
    function initializeRouteOverview() {
        const routeItems = document.querySelectorAll('.route-item');
        
        routeItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                // Highlight route progression
                routeItems.forEach((ri, i) => {
                    ri.classList.remove('route-active', 'route-completed');
                    if (i <= index) {
                        ri.classList.add(i === index ? 'route-active' : 'route-completed');
                    }
                });
            });
        });
    }

    // Initialize all enhanced features
    initializeCollapsibleSections();
    initializePhotoSpots();
    initializeRestaurantCards();
    initializeBudgetCalculator();
    enhanceWeatherDisplay();
    initializeRouteOverview();

    // Timeline item animations
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const timelineObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                entry.target.style.animationDelay = delay + 'ms';
                entry.target.classList.add('slide-in-left');
            }
        });
    }, observerOptions);
    
    timelineItems.forEach(item => timelineObserver.observe(item));

    // Stats counter animation
    const statsNumbers = document.querySelectorAll('.stat-number');
    
    function animateCounter(element, target) {
        const duration = 2000;
        const start = performance.now();
        const startValue = 0;
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOut);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.textContent);
                animateCounter(entry.target, target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsNumbers.forEach(stat => statsObserver.observe(stat));

    // Mobile menu toggle (if needed for future expansion)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navContainer = document.querySelector('.nav-container');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navContainer.classList.toggle('show');
            this.classList.toggle('active');
        });
    }

    // Lazy loading for future images
    function lazyLoadImages() {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('loading');
                    observer.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    lazyLoadImages();

    // Add touch gestures for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // Horizontal swipe detection
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > 50) { // Minimum swipe distance
                if (diffX > 0) {
                    // Swipe left - could trigger next section
                    console.log('Swiped left');
                } else {
                    // Swipe right - could trigger previous section
                    console.log('Swiped right');
                }
            }
        }
    });

    // Scroll progress indicator
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Create progress bar if it doesn't exist
        let progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(90deg, #3b82f6, #10b981);
                z-index: 1000;
                transition: width 0.1s ease;
            `;
            document.body.appendChild(progressBar);
        }
        
        progressBar.style.width = scrollPercent + '%';
    }
    
    window.addEventListener('scroll', updateScrollProgress);

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        const currentSection = document.querySelector('section:hover') || 
                             document.querySelector('.nav-link.active')?.getAttribute('href')?.replace('#', '');
        
        if (e.key === 'ArrowDown' && currentSection) {
            const sections = Array.from(document.querySelectorAll('section[id]'));
            const currentIndex = sections.findIndex(section => section.id === currentSection);
            const nextSection = sections[currentIndex + 1];
            
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (e.key === 'ArrowUp' && currentSection) {
            const sections = Array.from(document.querySelectorAll('section[id]'));
            const currentIndex = sections.findIndex(section => section.id === currentSection);
            const prevSection = sections[currentIndex - 1];
            
            if (prevSection) {
                prevSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // Performance monitoring
    function logPerformance() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
        }
    }
    
    window.addEventListener('load', logPerformance);

    // Error handling for failed resources
    window.addEventListener('error', function(e) {
        console.warn('Resource failed to load:', e.target.src || e.target.href);
        
        // Handle image load errors
        if (e.target.tagName === 'IMG') {
            e.target.style.display = 'none';
        }
    });

    console.log('✨ 新疆旅游攻略页面初始化完成！');
});