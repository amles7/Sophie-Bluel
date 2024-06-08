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
  var button = document.createElement ("button")
  button.innerHTML = "Tous"
  