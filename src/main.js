// Import Firebase Auth functions
import { auth } from './firebaseConfig.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// 🔐 Signup Form Handler
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Signup successful!");
        signupForm.reset();
      })
      .catch((error) => {
        alert("Signup failed: " + error.message);
      });
  });
}

// 🔐 Login Form Handler
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Login successful!");
        loginForm.reset();
      })
      .catch((error) => {
        alert("Login failed: " + error.message);
      });
  });
}

// 🔓 Logout Button Handler
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    signOut(auth)
      .then(() => {
        alert("Logged out!");
      })
      .catch((error) => {
        alert("Logout error: " + error.message);
      });
  });
}

// 👀 Track Login State
onAuthStateChanged(auth, (user) => {
  const status = document.getElementById('user-status');
  if (user) {
    console.log("User is signed in:", user.email);
    if (status) status.textContent = `Logged in as ${user.email}`;
  } else {
    console.log("User is signed out");
    if (status) status.textContent = "Not logged in";
  }
});
// Toggle auth form visibility
window.toggleAuth = () => {
  const container = document.getElementById('auth-container');
  container.style.display = container.style.display === 'none' ? 'block' : 'none';
};
