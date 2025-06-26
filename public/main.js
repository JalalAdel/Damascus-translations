import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyA4bgEulJPrZYXgdKZFxo6ssShyUz_xGgE",
  authDomain: "damascus-translations.firebaseapp.com",
  projectId: "damascus-translations",
  storageBucket: "damascus-translations.appspot.com",
  messagingSenderId: "150876826458",
  appId: "1:150876826458:web:217bcf8dde8f51792c2163",
  measurementId: "G-VHJ0C1EL7E"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const authModal = document.getElementById('auth-modal');
const overlay = document.getElementById('overlay');
const authError = document.getElementById('auth-error');
const userNav = document.getElementById('user-nav');
const authToggle = document.getElementById('auth-toggle'); // Renamed for clarity
const userEmail = document.getElementById('user-email');
const logoutButton = document.getElementById('logout-button');

// Add this to the top of main.js
if (!authToggle) console.error('authToggle not found!');
if (!overlay) console.error('overlay not found!');

// Wrap event listeners in null checks:
if (authToggle) {
  authToggle.addEventListener('click', openAuthModal);
}

if (overlay) {
  overlay.addEventListener('click', closeAuthModal);
}

// Attach modal handlers
overlay.addEventListener('click', closeAuthModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAuthModal();
});

// Modal control functions
function openAuthModal() {
  console.log('Opening modal');
  authModal.style.display = 'flex';
  overlay.style.display = 'block';
  authError.textContent = '';
}

function closeAuthModal() {
  console.log('Closing modal');
  authModal.style.display = 'none';
  overlay.style.display = 'none';
}

// Auth form handlers
document.getElementById('signup-button').addEventListener('click', async (e) => {
  alert('Signup button clicked');
  e.preventDefault();
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  
  if (!email || !password) {
    authError.textContent = 'Please enter both email and password';
    return;
  }
  
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    closeAuthModal();
  } catch (error) {
    authError.textContent = getAuthErrorMessage(error.code);
  }
});

document.getElementById('login-button').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;
  
  if (!email || !password) {
    authError.textContent = 'Please enter both email and password';
    return;
  }
  
  try {
    await signInWithEmailAndPassword(auth, email, password);
    closeAuthModal();
  } catch (error) {
    authError.textContent = getAuthErrorMessage(error.code);
  }
});

document.getElementById('google-signin').addEventListener('click', async () => {
  const provider = new GoogleAuthProvider();
  
  try {
    await signInWithPopup(auth, provider);
    closeAuthModal();
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user') {
      authError.textContent = 'Sign in cancelled';
    } else {
      authError.textContent = getAuthErrorMessage(error.code);
    }
  }
});

// Auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    userEmail.textContent = user.email;
    userNav.style.display = 'block';
    authToggle.style.display = 'none'; // Use authToggle here
  } else {
    userNav.style.display = 'none';
    authToggle.style.display = 'block'; // Use authToggle here
  }
});

// Logout handler
logoutButton.addEventListener('click', () => {
  signOut(auth).catch((error) => {
    authError.textContent = getAuthErrorMessage(error.code);
  });
});

// Error mapping
function getAuthErrorMessage(code) {
  const messages = {
    'auth/email-already-in-use': 'Email already registered',
    'auth/invalid-email': 'Invalid email format',
    'auth/weak-password': 'Password too weak (min 6 characters)',
    'auth/wrong-password': 'Incorrect password',
    'auth/user-not-found': 'User not found',
    'auth/too-many-requests': 'Too many attempts, try again later'
  };
  return messages[code] || 'Authentication failed';
}

// Close auth modal function
const authClose = document.getElementById('auth-close');
if (authClose) {
  authClose.addEventListener('click', closeAuthModal);
}

// --- Shared UI Logic for All Pages ---

document.addEventListener("DOMContentLoaded", () => {
  // Quote button slide-in (works for both LTR and RTL)
  const quoteBtn = document.getElementById("quoteSlideBtn");
  const hero = document.querySelector(".hero-section");
  const contactSection = document.getElementById("contact");

  function getCssVar(name) {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  }

  if (quoteBtn && hero && contactSection) {
    window.addEventListener("scroll", () => {
      const navbarHeight = getCssVar("--navbar-height") || 80;
      const heroBottom = hero.offsetHeight;
      const contactTop = contactSection.offsetTop;

      const shouldShowQuoteBtn =
        window.scrollY > heroBottom &&
        window.scrollY < contactTop - navbarHeight;

      quoteBtn.classList.toggle("show", shouldShowQuoteBtn);
    });
  }

  // Navbar collapse/shrink logic
  const nav = document.querySelector('.navbar');
  const collapseEl = document.getElementById('navbarNav');
  if (nav && collapseEl && typeof bootstrap !== "undefined") {
    const bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });
    let isMenuOpen = false;
    let lastScrollY = window.scrollY;

    const toggler = document.querySelector('.navbar-toggler');
    if (toggler) {
      toggler.addEventListener('click', () => {
        isMenuOpen = !collapseEl.classList.contains('show');
        if (isMenuOpen) {
          bsCollapse.show();
          setTimeout(() => isMenuOpen = true, 300);
        }
      });
    }

    window.addEventListener('scroll', () => {
      if (window.innerWidth > 991) return;
      const scrollDown = window.scrollY > lastScrollY;
      if (scrollDown && collapseEl.classList.contains('show')) {
        bsCollapse.hide();
        isMenuOpen = false;
      }
      nav.classList.toggle('navbar--shrink', window.scrollY > 50);
      lastScrollY = window.scrollY;
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => bsCollapse.hide());
    });
  }

  // Carousel (testimonials)
  const testimonialCarousel = document.getElementById('testimonialCarousel');
  if (testimonialCarousel && typeof bootstrap !== "undefined") {
    new bootstrap.Carousel(testimonialCarousel, { interval: false, wrap: true });
  }

  // Contact form validation and redirection (index.html & indexAr.html)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const name = document.getElementById('name')?.value;
      const email = document.getElementById('email')?.value;
      const service = document.getElementById('service')?.value;
      const message = document.getElementById('message')?.value;

      // Detect language by page
      const isArabic = document.documentElement.lang === 'ar';
      if (name && email && service && message) {
        window.location.href = isArabic ? 'quotationAr.html' : 'quotation.html';
      } else {
        contactForm.reportValidity();
      }
    });
  }

  // Quotation page logic (quotation.html & quotationAr.html)
  // Only run if on a quotation page
  if (window.location.pathname.endsWith('quotation.html') || window.location.pathname.endsWith('quotationAr.html')) {
    // Place all quotation page JS here (validation, tab switching, etc.)
    // You can move the relevant JS from those files here.
    // For brevity, not included in this snippet.
  }
});