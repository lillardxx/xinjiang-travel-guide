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

    // Sidebar functionality
    function initializeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebarClose = document.getElementById('sidebarClose');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const mainWrapper = document.getElementById('mainWrapper');
        
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        const sidebarDayLinks = document.querySelectorAll('.sidebar-day-link');
        const dayCards = document.querySelectorAll('.day-card');
        
        // Store sidebar state in localStorage
        let sidebarOpen = localStorage.getItem('sidebarOpen') === 'true';
        
        // Initialize sidebar state
        function setSidebarState(isOpen) {
            if (isOpen) {
                sidebar.classList.add('active');
                sidebarToggle.classList.add('active');
                if (window.innerWidth > 768) {
                    mainWrapper.classList.add('sidebar-open');
                } else {
                    sidebarOverlay.classList.add('active');
                }
            } else {
                sidebar.classList.remove('active');
                sidebarToggle.classList.remove('active');
                mainWrapper.classList.remove('sidebar-open');
                sidebarOverlay.classList.remove('active');
            }
            localStorage.setItem('sidebarOpen', isOpen);
        }
        
        // Set initial state
        setSidebarState(sidebarOpen);
        
        // Toggle sidebar
        sidebarToggle.addEventListener('click', function() {
            sidebarOpen = !sidebarOpen;
            setSidebarState(sidebarOpen);
        });
        
        // Close sidebar
        sidebarClose.addEventListener('click', function() {
            sidebarOpen = false;
            setSidebarState(sidebarOpen);
        });
        
        // Close sidebar on overlay click (mobile)
        sidebarOverlay.addEventListener('click', function() {
            sidebarOpen = false;
            setSidebarState(sidebarOpen);
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth <= 768) {
                mainWrapper.classList.remove('sidebar-open');
                if (sidebarOpen) {
                    sidebarOverlay.classList.add('active');
                }
            } else {
                sidebarOverlay.classList.remove('active');
                if (sidebarOpen) {
                    mainWrapper.classList.add('sidebar-open');
                }
            }
        });
        
        // Add click handlers to sidebar navigation
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerOffset = 80;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active state
                    sidebarLinks.forEach(navLink => navLink.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth <= 768) {
                        sidebarOpen = false;
                        setSidebarState(sidebarOpen);
                    }
                }
            });
        });
        
        // Add click handlers to day navigation
        sidebarDayLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Don't prevent default for external links (.html pages)
                if (this.getAttribute('href').includes('.html')) {
                    // Close sidebar on mobile before navigation
                    if (window.innerWidth <= 768) {
                        sidebarOpen = false;
                        setSidebarState(sidebarOpen);
                    }
                    return; // Let the browser handle the navigation
                }
                
                // Original logic for anchor links (if any remain)
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerOffset = 80;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active state
                    sidebarDayLinks.forEach(navLink => navLink.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth <= 768) {
                        sidebarOpen = false;
                        setSidebarState(sidebarOpen);
                    }
                }
            });
        });
        
        // Update active nav on scroll
        function updateSidebarNavOnScroll() {
            const scrollPos = window.scrollY + 150;
            
            // Check main sections
            const sections = ['itinerary', 'highlights'];
            sections.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                if (section) {
                    const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
                    const sectionHeight = section.offsetHeight;
                    
                    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                        sidebarLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${sectionId}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                }
            });
            
            // Check day cards
            dayCards.forEach(card => {
                const cardTop = card.getBoundingClientRect().top + window.pageYOffset;
                const cardHeight = card.offsetHeight;
                const cardId = card.getAttribute('id');
                
                if (scrollPos >= cardTop && scrollPos < cardTop + cardHeight) {
                    sidebarDayLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${cardId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
        
        window.addEventListener('scroll', updateSidebarNavOnScroll);
        
        // Set initial active states
        if (sidebarLinks.length > 0) {
            sidebarLinks[0].classList.add('active');
        }
        if (sidebarDayLinks.length > 0) {
            sidebarDayLinks[0].classList.add('active');
        }
    }

    // Route navigation functionality
    function initializeRouteNavigation() {
        const routeItems = document.querySelectorAll('.route-item');
        
        routeItems.forEach(item => {
            // Skip arrow elements
            if (item.classList.contains('route-arrow')) return;
            
            const text = item.textContent.trim();
            
            // Define mappings from route text to timeline items
            const routeMap = {
                // Day 1 routes
                '天山国际机场': '抵达天山国际机场',
                '市区酒店': '酒店入住休息',
                '国际大巴扎': '国际大巴扎',
                '维也纳酒店': '维也纳酒店',
                
                // Day 2 routes
                '乌鲁木齐': '出发前往天山大峡谷',
                '天山大峡谷': '天山大峡谷',
                '返回酒店': '返回酒店',
                
                // Day 3 routes
                '独山子': '出发前往独山子',
                '独山子大峡谷': '独山子大峡谷游览',
                '克拉玛依': '前往克拉玛依',
                
                // Day 4 routes
                '赛里木湖': '赛里木湖',
                '日出拍摄': '早起观日出',
                '环湖自驾': '环湖自驾',
                '博乐': '博乐市',
                
                // Day 5 routes
                '吐鲁番': '火焰山景区',
                '火焰山': '火焰山景区',
                '坎儿井': '坎儿井民俗园',
                '葡萄沟': '葡萄沟风景区',
                
                // Day 6 routes
                '返程': '返程乌鲁木齐',
                '返回': '返程乌鲁木齐',
                '返回乌鲁木齐': '返程乌鲁木齐',
                '机场': '前往机场'
            };
            
            // Check if this route item has a corresponding timeline item
            const targetText = routeMap[text];
            if (targetText) {
                item.classList.add('clickable');
                
                item.addEventListener('click', function() {
                    // Add click animation
                    this.classList.add('clicked');
                    setTimeout(() => {
                        this.classList.remove('clicked');
                    }, 300);
                    
                    // Find the timeline item containing the target text
                    const timelineItems = document.querySelectorAll('.timeline-desc strong');
                    let targetTimeline = null;
                    
                    timelineItems.forEach(timelineItem => {
                        if (timelineItem.textContent.includes(targetText)) {
                            targetTimeline = timelineItem.closest('.timeline-item');
                        }
                    });
                    
                    if (targetTimeline) {
                        // Check if the timeline item is in a collapsed day section
                        const dayDetails = targetTimeline.closest('.day-details');
                        if (dayDetails && !dayDetails.classList.contains('active')) {
                            // Find the corresponding day button and expand it
                            const dayCard = dayDetails.closest('.day-card');
                            const dayButton = dayCard.querySelector('.day-expand-btn');
                            
                            if (dayButton) {
                                // Expand the day first
                                dayButton.click();
                                
                                // Wait for the expansion animation before scrolling
                                setTimeout(() => {
                                    scrollToTimeline();
                                }, 350);
                            } else {
                                scrollToTimeline();
                            }
                        } else {
                            scrollToTimeline();
                        }
                        
                        function scrollToTimeline() {
                            const headerOffset = 180; // Account for sticky navs
                            const elementPosition = targetTimeline.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                            
                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                            
                            // Highlight the target timeline item temporarily
                            targetTimeline.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                            targetTimeline.style.borderRadius = '8px';
                            targetTimeline.style.transition = 'background-color 0.3s ease';
                            
                            setTimeout(() => {
                                targetTimeline.style.backgroundColor = '';
                                setTimeout(() => {
                                    targetTimeline.style.borderRadius = '';
                                    targetTimeline.style.transition = '';
                                }, 300);
                            }, 2000);
                            
                            showToast(`跳转到：${targetText}`);
                        }
                    }
                });
            }
        });
    }

    // Day Details Expand/Collapse functionality
    function initializeDayExpansion() {
        const expandButtons = document.querySelectorAll('.day-expand-btn');
        
        // Only initialize if there are expand buttons (for main page compatibility)
        if (expandButtons.length === 0) {
            return; // Exit early if no expand buttons found (independent day pages)
        }
        
        expandButtons.forEach(button => {
            button.addEventListener('click', function() {
                const dayNumber = this.getAttribute('data-day');
                const dayCard = document.getElementById(`day${dayNumber}`);
                const dayDetails = document.getElementById(`day${dayNumber}-details`);
                const icon = this.querySelector('.expand-icon');
                const text = this.querySelector('.expand-text');
                
                // Close all other expanded days
                document.querySelectorAll('.day-details.active').forEach(details => {
                    if (details.id !== `day${dayNumber}-details`) {
                        details.classList.remove('active');
                        const otherCard = details.closest('.day-card');
                        const otherButton = otherCard.querySelector('.day-expand-btn');
                        otherCard.classList.remove('expanded');
                        otherButton.classList.remove('active');
                        otherButton.querySelector('.expand-text').textContent = '查看详细安排';
                    }
                });
                
                // Toggle current day
                if (dayDetails.classList.contains('active')) {
                    // Collapse
                    dayDetails.classList.remove('active');
                    dayCard.classList.remove('expanded');
                    button.classList.remove('active');
                    text.textContent = '查看详细安排';
                } else {
                    // Expand
                    dayDetails.classList.add('active');
                    dayCard.classList.add('expanded');
                    button.classList.add('active');
                    text.textContent = '收起详细信息';
                    
                    // Smooth scroll to the expanded content
                    setTimeout(() => {
                        const headerOffset = 100;
                        const elementPosition = dayCard.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }, 300);
                }
            });
        });
        
        // Default expand Day 1 on page load (only for main page)
        setTimeout(() => {
            const day1Button = document.querySelector('[data-day="1"]');
            const day1Details = document.getElementById('day1-details');
            const day1Card = document.getElementById('day1');
            
            if (day1Button && day1Details && day1Card) {
                day1Details.classList.add('active');
                day1Card.classList.add('expanded');
                day1Button.classList.add('active');
                day1Button.querySelector('.expand-text').textContent = '收起详细信息';
            }
        }, 500);
    }

    // Initialize all enhanced features
    initializeCollapsibleSections();
    initializePhotoSpots();
    initializeRestaurantCards();
    initializeBudgetCalculator();
    enhanceWeatherDisplay();
    initializeRouteOverview();
    initializeSidebar();
    initializeRouteNavigation();
    initializeDayExpansion();

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