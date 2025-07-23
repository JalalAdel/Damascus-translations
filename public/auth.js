// auth.js (Version 6 - Final UI Toggle Fix)

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { auth, db } from './main.js';

// --- Get all HTML elements ---
const authModal = document.getElementById('auth-modal');
const overlay = document.getElementById('overlay');
const authToggle = document.getElementById('auth-toggle'); // Button inside the li
const authCloseButton = document.getElementById('auth-close');
const signupButton = document.getElementById('signup-button');
const loginButton = document.getElementById('login-button');
const googleButton = document.getElementById('google-signin');
const logoutButton = document.getElementById('logout-button');
const emailInput = document.getElementById('auth-email');
const passwordInput = document.getElementById('auth-password');
const authError = document.getElementById('auth-error');

// User Nav Elements
const userNav = document.getElementById('user-nav');
const userAvatar = document.getElementById('user-avatar');
const userDropdown = document.getElementById('user-dropdown-menu');
const dropdownUserEmail = document.getElementById('dropdown-user-email');

// MODIFICATION: Get the LIST ITEM for the auth toggle button
const authToggleLi = document.getElementById('auth-toggle-li');

// --- Modal and User Data functions (no changes) ---
const openAuthModal = () => { if (authModal) authModal.style.display = 'flex'; if (overlay) overlay.style.display = 'block'; };
const closeModal = () => { if (authModal) authModal.style.display = 'none'; if (overlay) overlay.style.display = 'none'; if (authError) authError.textContent = ''; };
const saveUserData = async (user) => {
  const userDocRef = doc(db, "users", user.uid);
  try { await setDoc(userDocRef, { uid: user.uid, email: user.email, displayName: user.displayName || 'Anonymous', createdAt: serverTimestamp() }, { merge: true }); } 
  catch (error) { console.error("Error saving user data:", error); }
};

// --- Attach Event Listeners (no changes) ---
if (authToggle) authToggle.addEventListener('click', openAuthModal);
if (authCloseButton) authCloseButton.addEventListener('click', closeModal);
if (overlay) overlay.addEventListener('click', closeModal);
if (logoutButton) logoutButton.addEventListener('click', () => signOut(auth));
if (signupButton) signupButton.addEventListener('click', async () => { try { await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value); closeModal(); } catch (error) { authError.textContent = error.message; } });
if (loginButton) loginButton.addEventListener('click', async () => { try { await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value); closeModal(); } catch (error) { authError.textContent = error.message; } });
if (googleButton) googleButton.addEventListener('click', async () => { const p = new GoogleAuthProvider(); try { await signInWithPopup(auth, p); closeModal(); } catch (error) { authError.textContent = error.message; } });
if (userAvatar) { userAvatar.addEventListener('click', (e) => { e.stopPropagation(); userDropdown.classList.toggle('show-dropdown'); }); }
window.addEventListener('click', () => { if (userDropdown && userDropdown.classList.contains('show-dropdown')) { userDropdown.classList.remove('show-dropdown'); } });

// --- Auth State Listener (The most important part) ---
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in
    saveUserData(user);

    // Show the user avatar and menu container
    if (userNav) userNav.style.display = 'block';
    
    // MODIFICATION: Hide the ENTIRE list item for the login button
    if (authToggleLi) authToggleLi.style.display = 'none';

    // Populate Avatar Initial
    if (userAvatar) {
        const nameSource = user.displayName || user.email;
        if (nameSource) userAvatar.textContent = nameSource.charAt(0).toUpperCase();
    }
    // Populate Dropdown Email
    if (dropdownUserEmail) {
        dropdownUserEmail.textContent = user.email;
    }

  } else {
    // User is signed out
    // Hide the user avatar and menu container
    if (userNav) userNav.style.display = 'none';

    // MODIFICATION: Show the ENTIRE list item for the login button
    if (authToggleLi) authToggleLi.style.display = 'block';
    
    // Ensure dropdown is hidden on logout
    if (userDropdown) userDropdown.classList.remove('show-dropdown'); 
  }
});