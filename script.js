document.addEventListener('DOMContentLoaded', () => {
    // Enhanced Logo Animation
    const logo = document.getElementById('logo');
    let isExpanded = false;
    let timeoutId;
    let touchStartTime;
    const touchDelay = 100; // ms threshold for touch events

    // Handle both click and touch events
    logo.addEventListener('touchstart', (e) => {
        touchStartTime = Date.now();
    }, { passive: true });

    logo.addEventListener('touchend', (e) => {
        const touchDuration = Date.now() - touchStartTime;
        if (touchDuration < touchDelay) {
            e.preventDefault();
            toggleLogo();
        }
    });

    logo.addEventListener('click', (e) => {
        if (e.pointerType !== 'touch') { // Prevent double triggering on touch devices
            toggleLogo();
        }
    });

    function toggleLogo() {
        isExpanded = !isExpanded;
        logo.classList.toggle('expanded');

        // Auto collapse after 3 seconds
        clearTimeout(timeoutId);
        if (isExpanded) {
            timeoutId = setTimeout(() => {
                logo.classList.remove('expanded');
                isExpanded = false;
            }, 3000);
        }
    }

    // Typewriter effect
    const typewriter = document.querySelector('.typewriter');
    const words = ['Web Developer', 'Designer', 'Problem Solver', 'Creative Thinker'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typewriterDelay = 100;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriter.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typewriterDelay = 50;
        } else {
            typewriter.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typewriterDelay = 150;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typewriterDelay = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typewriterDelay = 500; // Pause before starting new word
        }

        setTimeout(typeEffect, typewriterDelay);
    }

    typeEffect();

    // Mobile Navigation
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const navOverlay = document.querySelector('.nav-overlay');

    burger.addEventListener('click', () => {
        // Toggle Navigation
        nav.classList.toggle('nav-active');
        navOverlay.classList.toggle('active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });

    // Close nav when clicking overlay
    navOverlay.addEventListener('click', () => {
        nav.classList.remove('nav-active');
        navOverlay.classList.remove('active');
        burger.classList.remove('toggle');
        navLinks.forEach(link => link.style.animation = '');
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form Submission
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form submission logic here
        alert('Thank you for your message! I will get back to you soon.');
        form.reset();
    });

    // Scroll Animation for Skill Bars
    const skillSection = document.querySelector('.skills-container');
    const progressBars = document.querySelectorAll('.skill-progress');

    function showProgress() {
        progressBars.forEach(progress => {
            const value = progress.style.width;
            progress.style.width = '0';
            progress.style.width = value;
        });
    }

    if (skillSection) {
        window.addEventListener('scroll', () => {
            const sectionPos = skillSection.getBoundingClientRect().top;
            const screenPos = window.innerHeight / 2;

            if(sectionPos < screenPos) {
                showProgress();
            }
        });
    }

    // Add this function at the end of your existing JavaScript
    function initMap() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const amman = { lat: 31.9454, lng: 35.9284 };
        
        const darkMapStyle = [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }],
            },
            {
                featureType: "poi",
                elementType: "geometry",
                stylers: [{ color: "#283d6a" }],
            }
        ];

        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 12,
            center: amman,
            styles: isDark ? darkMapStyle : [],
        });

        new google.maps.Marker({
            position: amman,
            map: map,
            title: "Amman, Jordan",
            animation: google.maps.Animation.DROP
        });
    }

    // Animated number counting
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                // Add plus symbol and emoji after counting finishes
                obj.innerHTML += `+ <span class="stat-emoji">🎯</span>`;
            }
        };
        window.requestAnimationFrame(step);
    }

    // Intersection Observer for stats animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statItems = document.querySelectorAll('.stat-item');
                statItems.forEach(item => {
                    const statNumber = item.querySelector('.stat-number');
                    const target = parseInt(statNumber.getAttribute('data-target'));
                    animateValue(statNumber, 0, target, 2000);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        statsObserver.observe(statsContainer);
    }

    // Add smooth reveal animation for timeline items
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateX(0)';
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.timeline-item').forEach(item => {
        timelineObserver.observe(item);
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);

        // Add wave color transition
        const waves = document.querySelectorAll('.wave-path');
        waves.forEach(wave => {
            wave.style.transition = 'fill 0.3s ease';
        });
    });

    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Section reveal animation
    const revealSections = () => {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75) {
                section.classList.add('section-reveal', 'active');
            }
        });
    };

    // Initial check for sections in view
    revealSections();

    // Check on scroll
    window.addEventListener('scroll', revealSections);

    // Project Modal functionality
    const modal = document.getElementById('projectModal');
    const projectLinks = document.querySelectorAll('.project-link');
    const closeModal = document.querySelector('.close-modal');

    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const card = link.closest('.project-card');
            
            // Get project details from data attributes
            const title = card.dataset.title;
            const description = card.dataset.description;
            const image = card.dataset.image;
            const tech = card.dataset.tech.split(',');
            const liveLink = card.dataset.live;
            const githubLink = card.dataset.github;

            // Update modal content
            modal.querySelector('.modal-title').textContent = title;
            modal.querySelector('.modal-description').textContent = description;
            modal.querySelector('.modal-image').src = image;
            
            // Update tech stack
            const techStack = modal.querySelector('.tech-stack');
            techStack.innerHTML = tech.map(t => `<span class="tech-tag">${t.trim()}</span>`).join('');
            
            // Update links with proper URLs
            const liveDemoLink = modal.querySelector('.live-link');
            const githubRepoLink = modal.querySelector('.github-link');
            
            if (liveDemoLink && liveLink) {
                liveDemoLink.href = liveLink;
            }
            
            if (githubRepoLink && githubLink) {
                githubRepoLink.href = githubLink;
            }

            // Show modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal functionality
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Google Maps initialization
    function initMap() {
        // Replace these coordinates with your desired location
        const location = { lat: YOUR_LATITUDE, lng: YOUR_LONGITUDE };
        
        const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: location,
            styles: [
                {
                    "featureType": "all",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#242f3e"
                        }
                    ]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "lightness": -80
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#746855"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#17263c"
                        }
                    ]
                }
            ]
        });

        // Add a marker
        new google.maps.Marker({
            position: location,
            map: map,
            title: "Find me here!"
        });
    }

    // Handle map errors
    function handleMapError() {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = '<div class="map-error">Unable to load map. Please try again later.</div>';
        }
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        
        // Get form data
        const form = event.target;
        const formData = new FormData(form);
        
        // Here you would typically send the form data to your server
        // For now, we'll just simulate a successful submission
        
        // Show success modal
        const successModal = document.getElementById('successModal');
        successModal.style.display = 'block';
        
        // Clear form
        form.reset();
        
        // Add close functionality
        const closeButtons = successModal.querySelectorAll('.close-modal, .modal-close-btn');
        closeButtons.forEach(button => {
            button.onclick = function() {
                successModal.style.display = 'none';
            }
        });
        
        // Close modal when clicking outside
        window.onclick = function(event) {
            if (event.target === successModal) {
                successModal.style.display = 'none';
            }
        }
    }

    // Add this to your existing DOMContentLoaded event listener
    document.querySelectorAll('.neon-light').forEach(light => {
        let isLightOn = true;  // Start with lights on
        
        light.addEventListener('click', () => {
            isLightOn = !isLightOn;
            light.classList.toggle('on', isLightOn);
        });
    });

    // Profile Modal functionality
    const profileIcon = document.querySelector('.nav-profile-icon');
    const profileModal = document.getElementById('profileModal');
    const closeProfileModal = document.querySelector('.close-profile-modal');

    if (profileIcon && profileModal && closeProfileModal) {
        profileIcon.addEventListener('click', () => {
            profileModal.classList.add('active');
        });
        closeProfileModal.addEventListener('click', () => {
            profileModal.classList.remove('active');
        });
        // Close modal when clicking outside the modal content
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) {
                profileModal.classList.remove('active');
            }
        });
    }

    // Visitor Counter functionality
    function updateVisitorCount() {
        const visitorCountElement = document.getElementById('visitor-count');
        if (!visitorCountElement) return;

        // Get the current count from localStorage
        let count = localStorage.getItem('visitorCount');
        
        // If it's the first visit or count doesn't exist
        if (!count) {
            count = 1;
        } else {
            // Convert to number and increment
            count = parseInt(count) + 1;
        }
        
        // Save the new count
        localStorage.setItem('visitorCount', count);
        
        // Add animation effect
        visitorCountElement.style.transform = 'scale(1.2)';
        visitorCountElement.textContent = count.toLocaleString();
        
        // Reset animation
        setTimeout(() => {
            visitorCountElement.style.transform = 'scale(1)';
        }, 300);
    }

    // Call the function when the page loads
    updateVisitorCount();
}); 
