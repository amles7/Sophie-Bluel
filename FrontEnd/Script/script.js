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
  allButton.addEventListener("click", () => filterWorks('Tous'));
  categoryMenu.appendChild(allButton);

  // Ajouter un bouton pour chaque catégorie
  categories.forEach(category => {
    const button = document.createElement("button");
    button.innerText = category.name;
    button.addEventListener("click", () => filterWorks(category.id));
    categoryMenu.appendChild(button);
  });
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
});
      
