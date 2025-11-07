// Navigation Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Animated Statistics Counter
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Initialize stats animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Intersection Observer for scroll-triggered animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                entry.target.dataset.animated = 'true';
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        const target = stat.textContent.replace(/,/g, '');
        stat.dataset.target = target;
        stat.textContent = '0';
        observer.observe(stat);
    });
});

// Product Filtering
const searchInput = document.getElementById('product-search');
const categoryFilter = document.getElementById('category-filter');

if (searchInput && categoryFilter) {
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value.toLowerCase();
        const productCards = document.querySelectorAll('.product-card');

        productCards.forEach(card => {
            const productName = card.querySelector('.product-name').textContent.toLowerCase();
            const productSpecs = card.querySelector('.product-specs').textContent.toLowerCase();
            const productCategory = card.dataset.category?.toLowerCase() || '';

            const matchesSearch = productName.includes(searchTerm) || productSpecs.includes(searchTerm);
            const matchesCategory = !selectedCategory || selectedCategory === 'all' || productCategory === selectedCategory;

            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
}

// Contact Form Validation and WhatsApp Integration
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        
        let isValid = true;
        
        // Reset previous error states
        const fields = [name, email, phone, message];
        if (subject) fields.push(subject);
        fields.forEach(field => {
            if (field) field.style.borderColor = '';
        });
        
        // Validate name
        if (!name.value.trim()) {
            name.style.borderColor = '#ef4444';
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value)) {
            email.style.borderColor = '#ef4444';
            isValid = false;
        }
        
        // Validate phone (optional but if provided, should be valid)
        if (phone && phone.value.trim()) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(phone.value)) {
                phone.style.borderColor = '#ef4444';
                isValid = false;
            }
        }
        
        // Validate message
        if (!message.value.trim()) {
            message.style.borderColor = '#ef4444';
            isValid = false;
        }
        
        if (isValid) {
            // Format message for WhatsApp
            let whatsappMessage = '*New Contact Form Message*\n\n';
            whatsappMessage += `*Name:* ${name.value.trim()}\n`;
            whatsappMessage += `*Email:* ${email.value.trim()}\n`;
            
            if (phone && phone.value.trim()) {
                whatsappMessage += `*Phone:* ${phone.value.trim()}\n`;
            }
            
            if (subject && subject.value.trim()) {
                whatsappMessage += `*Subject:* ${subject.value.trim()}\n`;
            }
            
            whatsappMessage += `\n*Message:*\n${message.value.trim()}`;
            
            // WhatsApp number (without + and spaces)
            const whatsappNumber = '919447305247';
            
            // Encode message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Create WhatsApp URL
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');
            
            // Show success message
            alert('Opening WhatsApp to send your message. If WhatsApp doesn\'t open, please contact us directly at +91 9447305247');
            
            // Reset form after a short delay
            setTimeout(() => {
                contactForm.reset();
            }, 500);
        } else {
            alert('Please fill in all required fields correctly.');
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to current page in navigation
const currentPage = window.location.pathname.split('/').pop() || '';
document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPage = link.getAttribute('href');
    // Handle home page (empty or '/' or 'index.html')
    if ((currentPage === '' || currentPage === 'index.html') && (linkPage === '/' || linkPage === '' || linkPage === 'index.html')) {
        link.style.color = 'var(--primary-color)';
        link.style.fontWeight = 'bold';
    } 
    // Handle other pages (with or without .html extension)
    else if (currentPage === linkPage || 
             currentPage === linkPage + '.html' || 
             (currentPage.endsWith('.html') && currentPage.replace('.html', '') === linkPage)) {
        link.style.color = 'var(--primary-color)';
        link.style.fontWeight = 'bold';
    }
});

// WhatsApp Inquiry Functionality
document.addEventListener('DOMContentLoaded', () => {
    const inquireButtons = document.querySelectorAll('.inquire-btn');
    
    inquireButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productName = button.getAttribute('data-product');
            const phoneNumber = '919447305247'; // WhatsApp number without + and spaces
            const message = encodeURIComponent(`Hello, I am interested in ${productName}. I would like to know more about this product.`);
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        });
    });
});

// Disable browser back button
(function() {
    history.pushState(null, null, location.href);
    window.onpopstate = function() {
        history.go(1);
    };
})();

// Page Load Animation Sequence
document.addEventListener('DOMContentLoaded', () => {
    // Logo animation
    const logo = document.querySelector('.logo img');
    if (logo) {
        logo.style.opacity = '0';
        logo.style.transform = 'scale(0.5)';
        setTimeout(() => {
            logo.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            logo.style.opacity = '1';
            logo.style.transform = 'scale(1)';
        }, 100);
    }
    
    // Navigation links slide-in animation
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            link.style.transition = `opacity 0.5s ease-out ${0.2 + index * 0.1}s, transform 0.5s ease-out ${0.2 + index * 0.1}s`;
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 200 + index * 100);
    });
    
    // Hero section animations
    const heroTitle = document.querySelector('.hero h1');
    const heroSubtitle = document.querySelector('.hero p');
    const heroButtons = document.querySelectorAll('.hero .btn');
    
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        heroTitle.classList.add('gradient-text');
        setTimeout(() => {
            heroTitle.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 100);
    }
    
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(30px)';
        setTimeout(() => {
            heroSubtitle.style.transition = 'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s';
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 300);
    }
    
    heroButtons.forEach((btn, index) => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(30px) scale(0.9)';
        setTimeout(() => {
            btn.style.transition = `opacity 0.8s ease-out ${0.4 + index * 0.1}s, transform 0.8s ease-out ${0.4 + index * 0.1}s`;
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0) scale(1)';
        }, 500 + index * 100);
    });
    
    // Product Gallery Modal - Initialize with product images
    initializeProductGallery();
});

// Product Gallery Modal with Swipe Functionality
function initializeProductGallery() {
    // Get products from localStorage (admin products)
    function getProductsFromStorage() {
        const stored = localStorage.getItem('adminProducts');
        return stored ? JSON.parse(stored) : [];
    }

    // Build product images object from localStorage
    const adminProducts = getProductsFromStorage();
    const productImages = {};
    
    adminProducts.forEach(product => {
        if (product.images && product.images.length > 0) {
            productImages[product.name] = product.images.map((src, index) => ({
                src: src,
                alt: `${product.name} - Image ${index + 1}`
            }));
        }
    });

    // Fallback default images if no admin products
    if (Object.keys(productImages).length === 0) {
        // Keep some default products for initial display
        productImages['Solar Inverter Pro 5KW'] = [
            { src: 'products/solar-inverter-5kw/image1.jpg', alt: 'Solar Inverter Pro 5KW - Front View' },
            { src: 'products/solar-inverter-5kw/image2.jpg', alt: 'Solar Inverter Pro 5KW - Side View' }
        ];
    }
    
    // Create modal HTML
    const modalHTML = `
        <div class="product-gallery-modal" id="product-gallery-modal">
            <button class="gallery-close" id="gallery-close">&times;</button>
            <div class="gallery-counter" id="gallery-counter">1 / 1</div>
            <div class="gallery-container">
                <button class="gallery-nav prev" id="gallery-prev">&#8249;</button>
                <button class="gallery-nav next" id="gallery-next">&#8250;</button>
                <div class="gallery-main-image" id="gallery-main-image"></div>
                <div class="gallery-thumbnails" id="gallery-thumbnails"></div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.getElementById('product-gallery-modal');
    const closeBtn = document.getElementById('gallery-close');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    const mainImage = document.getElementById('gallery-main-image');
    const thumbnails = document.getElementById('gallery-thumbnails');
    const counter = document.getElementById('gallery-counter');
    
    let currentProduct = null;
    let currentImages = [];
    let currentIndex = 0;
    
    // Function to render actual product image
    function renderImage(imageData) {
        const img = document.createElement('img');
        img.src = imageData.src;
        img.alt = imageData.alt || 'Product Image';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        img.style.borderRadius = '0.5rem';
        
        // Handle image load error - show placeholder
        img.onerror = function() {
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.style.width = '100%';
            placeholder.style.height = '100%';
            placeholder.style.display = 'flex';
            placeholder.style.alignItems = 'center';
            placeholder.style.justifyContent = 'center';
            placeholder.style.background = 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)';
            placeholder.style.borderRadius = '0.5rem';
            placeholder.style.color = '#64748b';
            placeholder.style.fontSize = '1rem';
            placeholder.textContent = 'Image not found: ' + imageData.src;
            this.parentNode.appendChild(placeholder);
        };
        
        return img;
    }
    
    // Function to open gallery
    function openGallery(productName) {
        currentProduct = productName;
        currentImages = productImages[productName] || [
            { src: 'products/placeholder.jpg', alt: productName }
        ];
        currentIndex = 0;
        updateGallery();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Function to update gallery display
    function updateGallery() {
        if (currentImages.length === 0) return;
        
        const currentImage = currentImages[currentIndex];
        
        // Clear and add main image
        mainImage.innerHTML = '';
        const mainImg = renderImage(currentImage);
        mainImage.appendChild(mainImg);
        
        // Update counter
        counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
        
        // Update thumbnails
        thumbnails.innerHTML = '';
        currentImages.forEach((image, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'gallery-thumbnail';
            if (index === currentIndex) thumb.classList.add('active');
            
            const thumbImg = document.createElement('img');
            thumbImg.src = image.src;
            thumbImg.alt = image.alt || 'Thumbnail';
            thumbImg.style.width = '100%';
            thumbImg.style.height = '100%';
            thumbImg.style.objectFit = 'cover';
            thumbImg.style.borderRadius = '0.375rem';
            
            // Handle thumbnail load error
            thumbImg.onerror = function() {
                this.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.style.width = '100%';
                placeholder.style.height = '100%';
                placeholder.style.display = 'flex';
                placeholder.style.alignItems = 'center';
                placeholder.style.justifyContent = 'center';
                placeholder.style.background = 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)';
                placeholder.style.borderRadius = '0.375rem';
                placeholder.style.fontSize = '0.75rem';
                placeholder.style.color = '#64748b';
                placeholder.textContent = 'No Image';
                this.parentNode.appendChild(placeholder);
            };
            
            thumb.appendChild(thumbImg);
            thumb.addEventListener('click', () => {
                currentIndex = index;
                updateGallery();
            });
            thumbnails.appendChild(thumb);
        });
        
        // Update navigation buttons
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === currentImages.length - 1;
    }
    
    // Navigation functions
    function nextImage() {
        if (currentIndex < currentImages.length - 1) {
            currentIndex++;
            updateGallery();
        }
    }
    
    function prevImage() {
        if (currentIndex > 0) {
            currentIndex--;
            updateGallery();
        }
    }
    
    // Event listeners
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    });
    
    // Swipe functionality for touch devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    mainImage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    mainImage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                nextImage();
            } else {
                // Swipe right - previous image
                prevImage();
            }
        }
    }
    
    // Mouse drag support for desktop
    let isDragging = false;
    let dragStartX = 0;
    
    mainImage.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragStartX = e.clientX;
        mainImage.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    document.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        
        const diff = dragStartX - e.clientX;
        const swipeThreshold = 50;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
        
        isDragging = false;
        mainImage.style.cursor = 'grab';
    });
    
    // Make product images clickable (using event delegation for dynamically loaded products)
    document.addEventListener('click', (e) => {
        const productImage = e.target.closest('.product-image');
        if (productImage) {
            const productCard = productImage.closest('.product-card');
            if (productCard) {
                const productName = productCard.querySelector('.product-name');
                if (productName) {
                    openGallery(productName.textContent.trim());
                }
            }
        }
    });

    // Also attach to existing product images
    document.querySelectorAll('.product-image').forEach(image => {
        image.style.cursor = 'pointer';
    });
}

// Extended Intersection Observer for Scroll Animations
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const sectionTitles = document.querySelectorAll('.section-title, .section-subtitle');
    const productCards = document.querySelectorAll('.product-card');
    const statCards = document.querySelectorAll('.stat-card');
    const linkCards = document.querySelectorAll('.link-card');
    const serviceCards = document.querySelectorAll('.service-card');
    
    // Create intersection observer for scroll animations
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all animate-on-scroll elements
    animateElements.forEach(element => {
        scrollObserver.observe(element);
    });
    
    // Animate section titles
    sectionTitles.forEach(title => {
        title.classList.add('animate-on-scroll');
        scrollObserver.observe(title);
    });
    
    // Staggered animation for product cards
    productCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.transitionDelay = `${index * 0.1}s`;
        scrollObserver.observe(card);
    });
    
    // Staggered animation for stat cards
    statCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.transitionDelay = `${index * 0.1}s`;
        scrollObserver.observe(card);
    });
    
    // Staggered animation for link cards
    linkCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.transitionDelay = `${index * 0.1}s`;
        scrollObserver.observe(card);
    });
    
    // Staggered animation for service cards
    serviceCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.transitionDelay = `${index * 0.1}s`;
        scrollObserver.observe(card);
    });
});

// Parallax Scrolling Effect for Hero Section Background
document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.3;
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                heroContent.style.opacity = Math.max(0, 1 - scrolled / 500);
            }
        });
    }
});

// Button Click Animation with Ripple Effect
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            // Add ripple styles if not already in CSS
            if (!document.querySelector('#ripple-style')) {
                const style = document.createElement('style');
                style.id = 'ripple-style';
                style.textContent = `
                    .btn {
                        position: relative;
                        overflow: hidden;
                    }
                    .btn .ripple {
                        position: absolute;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.6);
                        transform: scale(0);
                        animation: ripple-animation 0.6s ease-out;
                        pointer-events: none;
                    }
                    @keyframes ripple-animation {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Scroll Progress Bar
document.addEventListener('DOMContentLoaded', () => {
    // Create scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
});

// Navbar Scroll Animation
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (header) {
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -1px rgba(0, 0, 0, 0.1)';
            header.style.backdropFilter = 'blur(15px)';
            header.style.transform = 'translateY(0)';
        } else {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            header.style.backdropFilter = 'blur(10px)';
        }
    }
    
    lastScroll = currentScroll;
});

// Scroll Reveal Animation (with visibility fallback)
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        // Check if element is already visible
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            element.classList.add('revealed');
        }
        revealObserver.observe(element);
    });
    
    // Add scroll-reveal class to sections (only if not already visible)
    document.querySelectorAll('section').forEach((section, index) => {
        if (!section.classList.contains('hero')) {
            const rect = section.getBoundingClientRect();
            // Only add scroll-reveal if section is below viewport
            if (rect.top > window.innerHeight) {
                section.classList.add('scroll-reveal');
                section.style.animationDelay = `${index * 0.1}s`;
            }
        }
    });
    
    // Fallback: reveal all after 3 seconds
    setTimeout(() => {
        document.querySelectorAll('.scroll-reveal').forEach(element => {
            if (!element.classList.contains('revealed')) {
                element.classList.add('revealed');
            }
        });
    }, 3000);
});

// Image Loading Animation
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    });
});

// Enhanced Magnetic Hover Effect for Cards (combines with 3D tilt)
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.product-card, .stat-card, .link-card, .service-card');
    
    cards.forEach(card => {
        let isHovering = false;
        
        card.addEventListener('mouseenter', function() {
            isHovering = true;
        });
        
        card.addEventListener('mousemove', function(e) {
            if (!isHovering) return;
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // 3D tilt effect
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            // Magnetic effect
            const moveX = (x - centerX) / 20;
            const moveY = (y - centerY) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${moveX}px, ${moveY}px) translateY(-5px) scale(1.02)`;
            this.style.transition = 'none';
        });
        
        card.addEventListener('mouseleave', function() {
            isHovering = false;
            this.style.transition = 'all 0.3s ease';
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translate(0, 0) translateY(0) scale(1)';
        });
    });
});

// Text Reveal Animation on Scroll (with fallback to ensure visibility)
document.addEventListener('DOMContentLoaded', () => {
    const textElements = document.querySelectorAll('h1, h2, h3, .section-title');
    textElements.forEach((element, index) => {
        // Only animate if element is not in viewport initially
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (!isVisible) {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 50);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(element);
        
        // Fallback: make visible after 2 seconds if animation didn't trigger
        setTimeout(() => {
            if (element.style.opacity === '0') {
                element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        }, 2000);
    });
});

// Add stagger animation to list items (optional, doesn't hide content)
document.addEventListener('DOMContentLoaded', () => {
    const lists = document.querySelectorAll('.footer-section ul li');
    lists.forEach((li, index) => {
        li.classList.add('stagger-item');
        li.style.animationDelay = `${index * 0.05}s`;
        // Make visible immediately, animation is subtle
        li.style.opacity = '1';
    });
});

// Add glow effect to buttons on scroll into view
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    const buttonObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'glowPulse 2s ease-in-out infinite';
            }
        });
    }, { threshold: 0.5 });
    
    buttons.forEach(btn => {
        buttonObserver.observe(btn);
    });
});

// Enhanced card hover effects with tilt (3D effect)
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.product-card, .stat-card, .link-card, .service-card');
    
    cards.forEach(card => {
        let isHovering = false;
        
        card.addEventListener('mouseenter', function() {
            isHovering = true;
        });
        
        card.addEventListener('mousemove', function(e) {
            if (!isHovering) return;
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
            this.style.transition = 'none';
        });
        
        card.addEventListener('mouseleave', function() {
            isHovering = false;
            this.style.transition = 'all 0.3s ease';
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });
});

