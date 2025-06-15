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