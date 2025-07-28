// ui.js - For all shared user interface scripts

document.addEventListener("DOMContentLoaded", () => {

  // --- Quote button slide-in ---
  const quoteBtn = document.getElementById("quoteSlideBtn");
  const hero = document.querySelector(".hero-section");
  const contactSection = document.getElementById("contact");

  function getCssVar(name) {
    // Provide a default value if the CSS variable isn't found
    const value = getComputedStyle(document.documentElement).getPropertyValue(name);
    return parseFloat(value) || 80; // Default to 80px if --navbar-height isn't set
  }

  // Only add the scroll listener if all required elements are on the page
  if (quoteBtn && hero && contactSection) {
    window.addEventListener("scroll", () => {
      const navbarHeight = getCssVar("--navbar-height");
      const heroBottom = hero.offsetHeight;
      const contactTop = contactSection.offsetTop;

      const shouldShowQuoteBtn =
        window.scrollY > heroBottom &&
        window.scrollY < contactTop - navbarHeight;

      quoteBtn.classList.toggle("show", shouldShowQuoteBtn);
    });
  }

  // --- Navbar collapse/shrink logic ---
  const nav = document.querySelector('.navbar');
  const collapseEl = document.getElementById('navbarNav');

  // Check if Bootstrap is loaded and the elements exist
  if (nav && collapseEl && typeof bootstrap !== "undefined") {
    const bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });
    let lastScrollY = window.scrollY;

    // Navbar toggler for mobile menu
    const toggler = document.querySelector('.navbar-toggler');
    if (toggler) {
      toggler.addEventListener('click', () => {
        // This toggles the menu open/closed
      });
    }

    // Hide mobile menu on scroll down
    window.addEventListener('scroll', () => {
      if (window.innerWidth <= 991) {
        if (window.scrollY > lastScrollY && collapseEl.classList.contains('show')) {
          bsCollapse.hide();
        }
        lastScrollY = window.scrollY;
      }
    });

    // Hide mobile menu when a nav link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (collapseEl.classList.contains('show')) {
          bsCollapse.hide();
        }
      });
    });
  }

  // --- Testimonials Carousel ---
  const testimonialCarousel = document.getElementById('testimonialCarousel');
  if (testimonialCarousel && typeof bootstrap !== "undefined") {
    new bootstrap.Carousel(testimonialCarousel, { interval: false, wrap: true });
  }

  // --- Contact Form Redirection Logic ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const name = document.getElementById('name')?.value;
      const email = document.getElementById('email')?.value;
      const service = document.getElementById('service')?.value;
      const message = document.getElementById('message')?.value;

      const isArabic = document.documentElement.lang === 'ar';
      if (name && email && service && message) {
        window.location.href = isArabic ? 'quotation_ar.html' : 'quotation.html';
      } else {
        contactForm.reportValidity();
      }
    });
  }
});