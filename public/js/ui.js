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

  // --- START: RESOURCES CAROUSEL INITIALIZATION ---
document.addEventListener('DOMContentLoaded', function () {
    const resourcesCarouselElement = document.getElementById('resourcesCarousel');

    // Check if the carousel exists on the current page before trying to initialize it
    if (resourcesCarouselElement) {
        // Create a new Bootstrap Carousel instance.
        // This ensures its functionality works correctly, especially on pages with multiple carousels.
        const resourcesCarousel = new bootstrap.Carousel(resourcesCarouselElement, {
            interval: false, // We don't want it to slide automatically
            wrap: true       // Allows the carousel to loop from the last item back to the first
        });
    }
});
// --- END: RESOURCES CAROUSEL INITIALIZATION ---

  // --- START: CONTACT FORM EMAILJS INTEGRATION ---
// Initialize EmailJS (replace YOUR_PUBLIC_KEY with your actual Public Key)
// Make sure the EmailJS CDN script is loaded in your HTML before ui.js!
emailjs.init("YWr00jt06-K5B1xtt"); // <<< IMPORTANT: REPLACE THIS!

const contactForm = document.getElementById('contactForm');
const contactSubmitBtn = document.getElementById('contactSubmitBtn');
const contactFormMessage = document.getElementById('contactFormMessage');

if (contactForm && contactSubmitBtn && contactFormMessage) {
  contactForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission (no redirect)

    // Simple client-side validation
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const serviceField = document.getElementById('service');
    const messageField = document.getElementById('message');

    if (!nameField.value || !emailField.value || !serviceField.value || !messageField.value) {
      contactFormMessage.style.color = 'red';
      contactFormMessage.textContent = 'Please fill in all required fields.';
      contactFormMessage.style.display = 'block';
      return;
    }

    contactSubmitBtn.disabled = true; // Disable button during submission
    contactSubmitBtn.textContent = 'Sending...'; // Optional: change button text
    contactFormMessage.style.display = 'none'; // Hide previous messages

    // Collect form data for EmailJS (using the 'name' attributes from HTML)
    const templateParams = {
      user_name: nameField.value,
      user_email: emailField.value,
      user_service: serviceField.value,
      user_message: messageField.value
    };

    try {
      // Replace with your actual EmailJS Service ID and Template ID
      const response = await emailjs.send(
        "service_oo9vipi",   // <<< IMPORTANT: REPLACE THIS!
        "template_80ep6mu",  // <<< IMPORTANT: REPLACE THIS!
        templateParams
      );

      console.log('Email successfully sent!', response);
      contactFormMessage.style.color = 'green';
      contactFormMessage.textContent = 'Your message has been sent successfully!';
      contactFormMessage.style.display = 'block';
      contactForm.reset(); // Clear form fields on success

    } catch (error) {
      console.error('Failed to send email:', error);
      contactFormMessage.style.color = 'red';
      contactFormMessage.textContent = 'Failed to send message. Please try again later.';
      contactFormMessage.style.display = 'block';
    } finally {
      contactSubmitBtn.disabled = false; // Re-enable button
      contactSubmitBtn.textContent = 'Proceed'; // Reset button text
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
    }
  });
}
// --- END: CONTACT FORM EMAILJS INTEGRATION ---

});