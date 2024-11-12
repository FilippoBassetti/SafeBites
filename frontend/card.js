const restaurants = [
    {
        name: "UVA E MENTA",
        image: 'uva_e_menta.png',
        address: "123 Street Name",
        category: "Italian",
        cost: "$$",
        tags: ["pizza", "birra", "hamburger"],
        isFavorite: false
    },
    {
        title: "KORALLO",
        image: "korallo.png",
        address: "456 Another St",
        category: "Pizza",
        cost: "$$$",
        tags: ["pizza", "gelato"],
        isFavorite: true
      },
      {
        title: "PARA TODOS",
        image: "para_todos.png",
        address: "789 Some Ave",
        category: "Mexican",
        cost: "$",
        tags: ["tacos", "beer"],
        isFavorite: false
      },
]

function generateCard(restaurant) {
    const card = document.createElement("div");
    card.classList.add("card");

    const cardTop = document.createElement("div"); /* top start */
    cardTop.classList.add("top");

    const cardImg = document.createElement("div");
    cardImg.classList.add("card-img");
    cardImg.style.backgroundImage = `url(img/restaurants_tmp/${restaurant.image})`;
    console.log(restaurant.image);

    cardTop.appendChild(cardImg);

    const favCheckbox = document.createElement("div");
    favCheckbox.classList.add("star-checkbox");

    const favInput = document.createElement("input");
    favInput.type = "checkbox";
    favInput.id = `favorite-${restaurant.title}`;
    favInput.checked = restaurant.isFavorite;


    const favLabel = document.createElement("label");
    favLabel.setAttribute("for", favInput.id);
    favLabel.textContent = "★";

    favCheckbox.appendChild(favInput)
    favCheckbox.appendChild(favLabel)

    cardTop.appendChild(favCheckbox); /* top end */

    card.appendChild(cardTop);

    const cardName = document.createElement("div"); /* middle */
    cardName.classList.add("card-name");
    cardName.textContent = restaurant.name;

    card.appendChild(cardName);

    const cardBottom = document.createElement("div"); /* top start */
    cardBottom.classList.add("bottom");

    const info = document.createElement("div");
    const indirizzo = document.createElement("div");
    indirizzo.classList.add("card-info");
    indirizzo.textContent = restaurant.address;
    const categoria = document.createElement("div");
    categoria.classList.add("card-info");
    categoria.textContent = restaurant.category;
    const costo = document.createElement("div");
    costo.classList.add("card-info");
    costo.textContent = "costo : " + restaurant.cost;
    info.appendChild(indirizzo);
    info.appendChild(categoria);
    info.appendChild(costo);

    cardBottom.appendChild(info);

    const tags = document.createElement("div");
    tags.classList.add("tags");
    restaurant.tags.forEach(tag => {
        const tagElement = document.createElement("span");
        tagElement.classList.add("tag");
        tagElement.textContent = tag;
        tags.appendChild(tagElement);
    });

    cardBottom.appendChild(tags);

    card.appendChild(cardBottom);

    return card;
}

function renderCards() {
    const container = document.getElementById("card-div");
    restaurants.forEach(restaurant => {
        const card = generateCard(restaurant);
        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", renderCards);