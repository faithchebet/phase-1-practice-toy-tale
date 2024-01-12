let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  
  fetchToys();

  
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    createToy();
  });

  
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then((response) => response.json())
      .then((toys) => {
        toys.forEach((toy) => {
          renderToy(toy);
        });
      });
  }

  
  function renderToy(toy) {
    const toyCard = document.createElement("div");
    toyCard.className = "card";

    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    
    const likeButton = toyCard.querySelector(".like-btn");
    likeButton.addEventListener("click", () => {
      increaseLikes(toy);
    });

    toyCollection.appendChild(toyCard);
  }

  
  function createToy() {
    const name = toyForm.querySelector('[name="name"]').value;
    const image = toyForm.querySelector('[name="image"]').value;

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: name,
        image: image,
        likes: 0,
      }),
    })
      .then((response) => response.json())
      .then((newToy) => {
        renderToy(newToy);
      });
  }

  
  function increaseLikes(toy) {
    const newNumberOfLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        likes: newNumberOfLikes,
      }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        
        const toyCard = toyCollection.querySelector(`# ${updatedToy.id}`);
        const likesElement = toyCard.querySelector("p");
        likesElement.textContent = `${updatedToy.likes} Likes`;
      });
  }
});

