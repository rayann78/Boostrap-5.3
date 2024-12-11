const gamesList = [
    {
        title: "Tekken",
        year: 1994,
        imageUrl: "https://cdn.dashfight.com/bcf6a9046a9ea4c1070d4aedb2981103c978a704.png",
        id: 1,
    },
    {
        title: "Minecraft",
        year: 2009,
        imageUrl: "https://m.media-amazon.com/images/I/61smNbXSW1L._AC_UF1000,1000_QL80_.jpg",
        id: 2,
    },
    {
        title: "Elden Ring",
        year: 2022,
        imageUrl: "https://pic.clubic.com/v1/images/1934271/raw?fit=smartCrop&width=1200&height=675&hash=e7519a9577a2b7291fa26880bb22bed6740836be",
        id: 3,
    },
    {
        title: "Street Fighter V",
        year: 2015,
        imageUrl: "https://gaming-cdn.com/images/products/671/orig/street-fighter-v-pc-jeu-steam-cover.jpg?v=1662539255",
        id: 4,
    },
    {
        title: "Half Life 2",
        year: 2004,
        imageUrl: "https://gaming-cdn.com/images/products/2284/orig/half-life-2-pc-mac-game-steam-cover.jpg?v=1650555068",
        id: 5,
    },
    {
        title: "Skyrim",
        year: 2011,
        imageUrl: "https://gaming-cdn.com/images/products/146/orig/the-elder-scrolls-v-skyrim-pc-jeu-steam-europe-cover.jpg?v=1661270991",
        id: 6,
    },
];

// Fonction principale pour écrire les cartes dynamiques
function writeDom() {
    const gameContainer = document.querySelector(".row");
    gameContainer.innerHTML = ""; // Réinitialiser les cartes
    gamesList.forEach((game) => gameContainer.innerHTML += generateCard(game));

    attachButtonEvents();
}

// Générer une carte HTML pour un jeu
function generateCard(game) {
    return `
        <article class="col">
            <div class="card shadow-sm">
                <img src="${game.imageUrl}" class="card-img-top" alt="${game.title}" />
                <div class="card-body">
                    <h5 class="card-title">${game.title}</h5>
                    <p class="card-text">Released in ${game.year}.</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group">
                            <button 
                                type="button" 
                                class="btn btn-sm btn-outline-secondary view" 
                                data-bs-toggle="modal" 
                                data-bs-target="#exampleModal" 
                                data-id="${game.id}">
                                View
                            </button>
                            <button 
                                type="button" 
                                class="btn btn-sm btn-outline-secondary edit" 
                                data-bs-toggle="modal" 
                                data-bs-target="#exampleModal" 
                                data-id="${game.id}">
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    `;
}

// Ajouter des événements aux boutons
function attachButtonEvents() {
    document.querySelectorAll(".view").forEach((btn) => {
        btn.addEventListener("click", (e) => viewModal(e.target.dataset.id));
    });
    document.querySelectorAll(".edit").forEach((btn) => {
        btn.addEventListener("click", (e) => editModal(e.target.dataset.id));
    });
}

// Afficher le modal "View"
function viewModal(gameId) {
    const game = gamesList.find((game) => game.id === parseInt(gameId));
    if (!game) return console.error("Game not found");

    modifyModal(
        game.title,
        `<img src="${game.imageUrl}" alt="${game.title}" class="img-fluid" />`,
        `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`
    );
}

// Afficher le modal "Edit"
function editModal(gameId) {
    const game = gamesList.find((game) => game.id === parseInt(gameId));
    if (!game) return console.error("Game not found");

    fetch("./form.html")
        .then((response) => response.ok ? response.text() : Promise.reject("Failed to load form.html"))
        .then((formHtml) => {
            modifyModal("Edit Game", formHtml, `
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary" id="saveChangesButton">Save</button>
            `);

            // Pré-remplir le formulaire
            document.querySelector("#gameTitle").value = game.title;
            document.querySelector("#gameYear").value = game.year;
            document.querySelector("#gameImageUrl").value = game.imageUrl;

            // Ajouter un événement au bouton "Save"
            document.querySelector("#saveChangesButton").addEventListener("click", () => {
                game.title = document.querySelector("#gameTitle").value;
                game.year = parseInt(document.querySelector("#gameYear").value);
                game.imageUrl = document.querySelector("#gameImageUrl").value;

                writeDom();
                bootstrap.Modal.getInstance(document.getElementById("exampleModal")).hide();
            });
        })
        .catch((error) => console.error(error));
}

// Modifier le contenu du modal
function modifyModal(title, body, footer) {
    document.querySelector(".modal-title").textContent = title;
    document.querySelector(".modal-body").innerHTML = body;
    document.querySelector(".modal-footer").innerHTML = footer;
}

// Initialiser les cartes au chargement de la page
document.addEventListener("DOMContentLoaded", writeDom);
