// DOM पूरी तरह से लोड होने के बाद ही सब कुछ चलाएँ
document.addEventListener('DOMContentLoaded', () => {
    
    // --- ज़रूरी एलिमेंट्स को चुनना ---
    const header = document.getElementById('mainHeader');
    const marquee = document.querySelector('.marquee-container');
    const menuToggle = document.getElementById('menuToggle');
    const navBar = document.querySelector('#mainHeader nav');
    
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    const heroSlideshows = document.querySelectorAll('.hero-background-slideshow');
    let currentHeroSlide = 0;
    
    // लाइटबॉक्स (Gallery)
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // --- NEW: Gallery Carousel Elements ---
    const galleryMarquee = document.querySelector('.gallery-marquee');
    const galleryPrevBtn = document.getElementById('gallery-prev');
    const galleryNextBtn = document.getElementById('gallery-next');

    // संपर्क फ़ॉर्म
    const contactForm = document.getElementById('contactForm');

    
    // --- 1. मोबाइल नेविगेशन (Hamburger Menu) ---
    function closeMobileNav() {
        if (navBar) {
            navBar.classList.remove('active');
        }
        if (menuToggle) {
            const icon = menuToggle.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }
    }

    if (menuToggle && navBar) {
        menuToggle.addEventListener('click', () => {
            navBar.classList.toggle('active');
            
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.className = navBar.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            }
        });
    }

    // --- 2. स्मूथ स्क्रॉल और हेडर/मार्की ऑफसेट ---
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); 

            const targetId = this.getAttribute('href');
            
            if (targetId === '#hero') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                closeMobileNav();
                return;
            }

            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const currentHeaderHeight = header ? header.offsetHeight : 0;
                const currentMarqueeHeight = marquee ? marquee.offsetHeight : 0;	
                const offset = currentHeaderHeight + currentMarqueeHeight;
                
                window.scrollTo({
                    top: targetSection.offsetTop - offset + 1, 
                    behavior: 'smooth'
                });
                
                closeMobileNav(); 
            }
        });
    });

    // --- 3. हेडर/मार्की पोजिशनिंग ---
    function adjustFixedElements() {
        const currentHeaderHeight = header ? header.offsetHeight : 0;
        
        if (marquee) {
            marquee.style.top = `${currentHeaderHeight}px`;	
        }
        if (navBar) { 
            navBar.style.top = `${currentHeaderHeight}px`;
        }
    }
    
    window.addEventListener('resize', adjustFixedElements); 
    adjustFixedElements(); // (Run once on load)

    // --- 4. हीरो स्लाइड शो ---
    function showHeroSlide(index) {
        heroSlideshows.forEach((img, i) => {
            img.classList.remove('active');
            if (i === index) {
                img.classList.add('active');
            }
        });
    }

    function nextHeroSlide() {
        currentHeroSlide = (currentHeroSlide + 1) % heroSlideshows.length;
        showHeroSlide(currentHeroSlide);
    }
    
    if (heroSlideshows.length > 0) {
        showHeroSlide(currentHeroSlide);	
        setInterval(nextHeroSlide, 5000); 
    }

    // --- 5. गैलरी लाइटबॉक्स ---
    if (lightbox && lightboxImage && lightboxClose) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.getAttribute('data-img-src');
                lightbox.style.display = 'block';
                lightboxImage.src = imgSrc;
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }

    // --- 6. --- NEW: Gallery Carousel Arrow Logic ---
    if (galleryMarquee && galleryPrevBtn && galleryNextBtn) {
        // एक आइटम 300px + 15px मार्जिन है
        const scrollAmount = 315; 

        galleryNextBtn.addEventListener('click', () => {
            galleryMarquee.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        galleryPrevBtn.addEventListener('click', () => {
            galleryMarquee.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }


    // --- 7. संपर्क फ़ॉर्म (SweetAlert के साथ) ---
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); 

            const form = e.target;
            const formspreeEndpoint = form.action; 
            const data = new FormData(form);
            
            try {
                const response = await fetch(formspreeEndpoint, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Message Sent!',
                        text: 'Your message has been successfully delivered. I will get back to you soon.',
                        customClass: { confirmButton: 'swal-btn' }
                    });
                    form.reset(); 
                } else {
                    const errorData = await response.json();
                    Swal.fire({
                        icon: 'error',
                        title: 'Submission Failed',
                        text: errorData.error || 'There was an issue sending your message. Please try again.',
                        customClass: { confirmButton: 'swal-btn-error' }
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Network Error',
                    text: 'Could not connect to the server. Please check your internet connection and try again.',
                    customClass: { confirmButton: 'swal-btn-error' }
                });
            }
        });
    }

}); // DOMContentLoaded का अंत