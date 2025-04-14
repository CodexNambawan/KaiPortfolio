// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, collection, deleteDoc, getDocs, addDoc, Timestamp, doc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyABf0dVoSRubWaEUWDPnoPQRaQ_dyx-82k",
    authDomain: "kai-s-portfolio.firebaseapp.com",
    projectId: "kai-s-portfolio",
    storageBucket: "kai-s-portfolio.firebasestorage.app",
    messagingSenderId: "1084062450329",
    appId: "1:1084062450329:web:30115ac2f04115b7502e08",
    measurementId: "G-83VR2KHY3N"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  // Wait for the DOM to be ready
  window.addEventListener('DOMContentLoaded', () => {
    const loggedInDiv = document.querySelector(".logged-in");
    const notLoggedInDiv = document.querySelector(".not-logged-in");
    const userEmail = document.querySelector(".logged-in .user-email");
    const userProfilePic = document.querySelector(".profile-picture");
  

    loadGalleryData();
  
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Show logged-in section
        loggedInDiv.style.display = "flex";
        notLoggedInDiv.style.display = "none";
    
        // Update user info
        userEmail.textContent = user.email;
        userProfilePic.src = user.photoURL;
      } else {
        // Show not-logged-in section
        loggedInDiv.style.display = "none";
        notLoggedInDiv.style.display = "flex";
      }
    });
  
    // Optional: Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
          window.location.href = "./login";
        });
      });
    }

    
  });

  // Function to load and display gallery data
  async function loadGalleryData() {
    const imagesList = document.getElementById("images-list");
    imagesList.innerHTML = ""; // Clear existing content
  
    try {
      const querySnapshot = await getDocs(collection(db, "gallery"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
  
        // Create image card element
        const card = document.createElement("div");
        card.classList.add("image-card");
  
        // Set the HTML inside the card
        card.innerHTML = `
          <img src="${data.imageUrl}" alt="${data.title}" style="max-width: 100%; max-height: 200px;">
          <h4 id="title">${data.title}</h4>
          <p id="description">${data.description}</p>
          <p id="type">${data.type}</p>
          <button class="delete-btn" data-id="${doc.id}">Delete</button>
        `;
  
        // Attach delete event listener
        const deleteBtn = card.querySelector(".delete-btn");
deleteBtn.addEventListener("click", async (e) => {
  const confirmDelete = confirm("Are you sure?");
  if (confirmDelete) {
    const docId = e.target.getAttribute("data-id");  // Use this to get the docId from the data-id attribute
    await deleteImage(docId);  // Use docId directly here
  }
});
  
        imagesList.appendChild(card);
      });

      const searchBar = document.getElementById("search-bar");
      const imageCards = document.querySelectorAll(".image-card");
  
      searchBar.addEventListener("input", () => {
      const query = searchBar.value.toLowerCase();
  
      imageCards.forEach((card) => {
          const title = card.querySelector("h4#title").textContent.toLowerCase();
          if (title.includes(query)) {
          card.style.display = "block";
          } else {
          card.style.display = "none";
          }
      });
      });


    } catch (error) {
      console.error("Error loading gallery data: ", error);
    }
  }
  
  
  

  
  // Function to handle image upload FIRESTORE

  async function saveImageDataToFirestore(title, description, type, imageUrl) {
    try {
      const docRef = await addDoc(collection(db, "gallery"), {
        title: title,
        description: description,
        type: type,
        uploadedAt: Timestamp.now(),  
        imageUrl: imageUrl, //Cloudinary URL
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  
  document.getElementById("upload-btn").addEventListener("click", async () => {
    const titleInput = document.getElementById("image-title");
    const descInput = document.getElementById("image-description");
    const typeSelect = document.getElementById("image-type");
    const imageInput = document.getElementById("image-upload");
  
    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const type = typeSelect.value;
    const imageFile = imageInput.files[0];
  
    if (!title || !description || !imageFile) {
      alert("Please fill out all fields.");
      return;
    }

     // Upload image to Cloudinary
  const cloudinaryUrl = "https://api.cloudinary.com/v1_1/dmy1qxx6s/image/upload";
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", "unsigned_upload");

  try {
    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    const imageUrl = data.secure_url; // Get the Cloudinary URL

    // Save data to Firestore (with Cloudinary URL)
    await saveImageDataToFirestore(title, description, type, imageUrl);

    // Reset the form and preview
    titleInput.value = "";
    descInput.value = "";
    imageInput.value = ""; // Reset image input
    window.location.reload();
    
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    alert("Error uploading image. Please try again.");
  }
});
  


async function deleteImage(docId) {
    try {
      await deleteDoc(doc(db, "gallery", docId));
      console.log(`Document ${docId} deleted`);
      loadGalleryData(); // Reload the list after deletion
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }