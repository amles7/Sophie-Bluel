async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    console.log(works); // Vérifiez les données ici
    generateWorks(works);
  } catch (error) {
    console.error("Erreur lors de la récupération des travaux :", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchWorks);
function generateWorks(works) {
  const sectionGallery = document.querySelector("#portfolio");
  let divGallery = document.querySelector(".gallery");

  if (!divGallery) {
    divGallery = document.createElement("div");
    divGallery.className = "gallery";
  } else {
    divGallery.innerHTML = "";
  }

  works.forEach(work => {
    const workElement = document.createElement("figure");
    workElement.className = work.id;

    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.alt = work.title;

    const nomElement = document.createElement("figcaption");
    nomElement.innerText = work.title;

    workElement.dataset.categoryId = work.categoryId;
    workElement.dataset.id = work.id;

    workElement.appendChild(imageElement);
    workElement.appendChild(nomElement);
    divGallery.appendChild(workElement);
  });

  sectionGallery.appendChild(divGallery);
}
async function fetchCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    generateCategoryMenu(categories);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
  }
}

function generateCategoryMenu(categories) {
  const categoryMenu = document.querySelector(".catégorie");

  // Ajouter un bouton pour afficher tous les travaux
  const allButton = document.createElement("button");
  allButton.innerText = "Tous";
  allButton.classList.add("active"); // Bouton "Tous" actif par défaut
  allButton.addEventListener("click", () => {
      setActiveButton(allButton);
      filterWorks('Tous');
  });
  categoryMenu.appendChild(allButton);

  // Ajouter un bouton pour chaque catégorie
  categories.forEach(category => {
      const button = document.createElement("button");
      button.innerText = category.name;
      button.addEventListener("click", () => {
          setActiveButton(button);
          filterWorks(category.id);
      });
      categoryMenu.appendChild(button);
  });
}

function setActiveButton(activeButton) {
  const buttons = document.querySelectorAll(".catégorie button");
  buttons.forEach(button => {
      button.classList.remove("active"); // Supprimer la classe 'active' de tous les boutons
  });
  activeButton.classList.add("active"); // Ajouter la classe 'active' au bouton cliqué
}
function filterWorks(categoryId) {
  const works = document.querySelectorAll(".gallery figure");
  works.forEach(work => {
    if (categoryId === 'Tous' || work.dataset.categoryId == categoryId) {
      work.style.display = 'block';
    } else {
      work.style.display = 'none';
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  fetchWorks();
  fetchCategories();
  
  const token = localStorage.getItem("token");
  if (token) {
      addEditLink();
      setupModal();
      setupLogout();
  }
});

// Fonction pour ajouter le lien "modifier"
function addEditLink() {
  const title = document.querySelector('#portfolio h2');
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  
  const editLink = document.createElement('a');
  editLink.id = 'editGalleryLink';
  editLink.innerHTML = '<img src="assets/icons/iconEditBlack.png" alt="modifier"> modifier';
  editLink.style.cursor = 'pointer';
  editLink.addEventListener('click', openModal);

  container.appendChild(title.cloneNode(true));
  container.appendChild(editLink);
  title.parentNode.replaceChild(container, title);
}

// Fonction pour configurer le lien de déconnexion
function setupLogout() {
  const navList = document.querySelector('nav ul');
  const loginLink = navList.querySelector('a[href="login.html"]');
  loginLink.textContent = 'logout';
  loginLink.href = '#';
  loginLink.addEventListener('click', (event) => {
      event.preventDefault();
      localStorage.removeItem('token');
      window.location.href = 'login.html';
  });
}

// Fonction pour créer et gérer la fenêtre modale
function setupModal() {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.id = 'mediaModal';
  modal.innerHTML = `
      <div class="modal-content">
          <span class="close">&times;</span>
          <div class="modal-view" id="galleryView">
              <h2>Galerie photo</h2>
              <div class="modal-gallery"></div>
              <button id="addPhotoButton">Ajouter une photo</button>
          </div>
          <div class="modal-view" id="addPhotoView" style="display:none;">
              <h2>Ajout photo</h2>
              <form id="addPhotoForm">
                  <label for="photoTitle">Titre</label>
                  <input type="text" id="photoTitle" name="title" required>
                  
                  <label for="photoCategory">Catégorie</label>
                  <select id="photoCategory" name="category" required></select>

                  <label for="photoFile">Image</label>
                  <input type="file" id="photoFile" name="image" accept=".jpg,.jpeg,.png" required>
                  
                  <button type="submit">Valider</button>
              </form>
              <button id="backToGalleryButton">Retour à la galerie</button>
          </div>
      </div>
  `;

  document.body.appendChild(modal);

  const closeModalButton = document.querySelector('.modal .close');
  const addPhotoButton = document.getElementById('addPhotoButton');
  const backToGalleryButton = document.getElementById('backToGalleryButton');
  const galleryView = document.getElementById('galleryView');
  const addPhotoView = document.getElementById('addPhotoView');
  const addPhotoForm = document.getElementById('addPhotoForm');

  closeModalButton.addEventListener('click', closeModal);
  window.addEventListener('click', (event) => {
      if (event.target === modal) {
          closeModal();
      }
  });

  addPhotoButton.addEventListener('click', () => {
      galleryView.style.display = 'none';
      addPhotoView.style.display = 'block';
  });

  backToGalleryButton.addEventListener('click', () => {
      addPhotoView.style.display = 'none';
      galleryView.style.display = 'block';
  });

  addPhotoForm.addEventListener('submit', submitPhotoForm);

  loadCategories();
  loadGalleryWorks();
}

function openModal() {
  loadGalleryWorks(); // Recharger les travaux chaque fois que le modal est ouvert
  document.getElementById('mediaModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('mediaModal').style.display = 'none';
}

// Charger les catégories dans le formulaire d'ajout de photo
function loadCategories() {
  fetch("http://localhost:5678/api/categories")
      .then(response => response.json())
      .then(categories => {
          const categorySelect = document.getElementById('photoCategory');
          categorySelect.innerHTML = ''; // Clear previous options
          categories.forEach(category => {
              const option = document.createElement('option');
              option.value = category.id;
              option.textContent = category.name;
              categorySelect.appendChild(option);
          });
      });
}

// Charger les travaux dans la modale
function loadGalleryWorks() {
  fetch("http://localhost:5678/api/works")
      .then(response => response.json())
      .then(works => {
          const gallery = document.querySelector('.modal-gallery');
          gallery.innerHTML = '';
          works.forEach(work => {
              const workElement = document.createElement('figure');
              workElement.innerHTML = `
                  <img src="${work.imageUrl}" alt="${work.title}">
                  <figcaption>${work.title}</figcaption>
                  <button class="deleteWorkButton" data-id="${work.id}">Supprimer</button>
              `;
              gallery.appendChild(workElement);
          });

          document.querySelectorAll('.deleteWorkButton').forEach(button => {
              button.addEventListener('click', () => {
                  deleteWork(button.dataset.id);
              });
          });
      });
}

// Fonction pour supprimer un travail
function deleteWork(workId) {
  fetch(`http://localhost:5678/api/works/${workId}`, {
      method: 'DELETE',
      headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
  })
  .then(response => {
      if (response.ok) {
          document.querySelector(`button[data-id="${workId}"]`).parentElement.remove();
          document.querySelector(`.gallery figure[data-id="${workId}"]`).remove();
      } else {
          console.error('Failed to delete work');
      }
  });
}

// Fonction pour soumettre le formulaire d'ajout de photo
function submitPhotoForm(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  fetch("http://localhost:5678/api/works", {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
  })
  .then(response => response.json())
  .then(work => {
      addNewWorkToGallery(work);
      addNewWorkToModal(work);
      closeModal();
  })
  .catch(error => console.error('Error:', error));
}

// Ajouter un nouveau travail à la galerie
function addNewWorkToGallery(work) {
  const gallery = document.querySelector('.gallery');
  const workElement = document.createElement('figure');
  workElement.dataset.id = work.id;
  workElement.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>
  `;
  gallery.appendChild(workElement);
}

// Ajouter un nouveau travail à la modale
function addNewWorkToModal(work) {
  const gallery = document.querySelector('.modal-gallery');
  const workElement = document.createElement('figure');
  workElement.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>
      <button class="deleteWorkButton" data-id="${work.id}">Supprimer</button>
  `;
  gallery.appendChild(workElement);

  document.querySelector(`button[data-id="${work.id}"]`).addEventListener('click', () => {
      deleteWork(work.id);
  });
}
