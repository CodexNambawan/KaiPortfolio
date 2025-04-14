// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABf0dVoSRubWaEUWDPnoPQRaQ_dyx-82k",
  authDomain: "kai-s-portfolio.firebaseapp.com",
  projectId: "kai-s-portfolio",
  storageBucket: "kai-s-portfolio.firebasestorage.app",
  messagingSenderId: "1084062450329",
  appId: "1:1084062450329:web:30115ac2f04115b7502e08",
  measurementId: "G-83VR2KHY3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Create the IntersectionObserver outside so it's reusable
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle("show", entry.isIntersecting);
      if (entry.isIntersecting) observer.unobserve(entry.target);
    });
  },
  {
    rootMargin: "1px",
  }
);

// Observe any .hidden element
function observeHiddenElement(element) {
  if (element.classList.contains('hidden')) {
    observer.observe(element);
  }
}

// DOM Ready
document.addEventListener("DOMContentLoaded", function () {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  console.log("Page loaded, scrolling to top...");

  // Observe static .hidden elements
  document.querySelectorAll(".hidden").forEach(observeHiddenElement);

  loadGalleryItems();
});

async function loadGalleryItems() {
  const galleryGrid = document.querySelector('.gallery-grid'); // Get the gallery grid
  const illustrationsRef = collection(db, 'gallery'); // Firestore collection

  try {
    const querySnapshot = await getDocs(illustrationsRef);

    // Loop through each document in Firestore and create a gallery item
    querySnapshot.forEach(doc => {
      const data = doc.data();  // Get the data for the current document
      const galleryItem = document.createElement('div');
      galleryItem.classList.add('gallery-item', 'hidden');

      galleryItem.innerHTML = `
        <div class="content">
          <img src="${data.imageUrl}" alt="${data.title}">
          <div class="hover-icon"><i class="fa-regular fa-hand-pointer"></i></div>
          <a class="hover-card">
            <h3>${data.title}</h3>
            <p>${data.description}</p>
            <p id="type">${data.type}</p>
            <a href="#" class="buttonp">Learn More</a>
          </a>
        </div>
      `;

      // Append the gallery item to the grid
      galleryGrid.appendChild(galleryItem);

      // Observe the new hidden item
      observeHiddenElement(galleryItem);
    });
  } catch (error) {
    console.error("Error fetching gallery items: ", error);
  }
}

// Menu toggle for mobile nav
const menu_btn = document.querySelector('.hamburger');
const mobile_menu = document.querySelector('.mobile-nav');

menu_btn.addEventListener('click', function () {
  menu_btn.classList.toggle('is-active');
  mobile_menu.classList.toggle('is-active');
});
