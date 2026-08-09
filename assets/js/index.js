const contentItems = document.querySelector(".content-items");
const btnFilter = document.querySelectorAll(".btn-filter");
const sunIcon = document.querySelector("#sun-icon");
let cartArticles = [];
let currentFilter = "All";

sunIcon.addEventListener("click", () => {
  document.body.classList.toggle("theme-dark");
});

btnFilter.forEach((button) => {
  button.addEventListener("click", (event) => {
    const target = event.target;
    const value = target.dataset.class;
    currentFilter = value;
    displayArticle();
  });
});

const displayArticle = () => {
  let texteAAfficher;
  if (currentFilter === "Active") {
    texteAAfficher = cartArticles.filter((el) => el.isActive === true);
  } else if (currentFilter === "Inactive") {
    texteAAfficher = cartArticles.filter((el) => el.isActive === false);
  } else {
    texteAAfficher = cartArticles;
  }
  const textNodes = texteAAfficher.map((article) => {
    return createArticlesElements(article);
  });

  contentItems.innerHTML = "";
  contentItems.append(...textNodes);
};

const fetchAllArticle = async () => {
  try {
    const response = await fetch("./data.json");
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! status : ${response.status}`);
    }
    const article = await response.json();
    cartArticles.push(...article);
    displayArticle();
  } catch (e) {
    console.log("Impossible de charger les articles :", e.message);
  }
};

const createArticlesElements = (article) => {
  const contentItem = document.createElement("div");
  contentItem.classList.add("content-item");

  const contentMainRow = document.createElement("div");
  contentMainRow.classList.add("content-main-row");

  const contentItemImage = document.createElement("div");
  contentItemImage.classList.add("content-item-image");

  const image = document.createElement("img");
  image.src = `${article.logo}`;
  image.alt = `${article.name}`;

  const contentItemText = document.createElement("div");
  contentItemText.classList.add("content-item-text");

  const h2 = document.createElement("h2");
  h2.textContent = `${article.name}`;

  const p = document.createElement("p");
  p.classList.add("content-item-text-paragraphe");
  p.textContent = `${article.description}`;

  const extensionActions = document.createElement("div");
  extensionActions.classList.add("extension-actions");

  const btnRemove = document.createElement("div");
  btnRemove.classList.add("btn-remove");

  const boutton = document.createElement("button");
  boutton.textContent = "Remove";

  boutton.addEventListener("click", () => {
    const findArticleIndex = cartArticles.findIndex(
      (el) => el.name === article.name
    );
    if (findArticleIndex !== -1) {
      cartArticles.splice(findArticleIndex, 1);
      displayArticle();
    }
  });

  const label = document.createElement("label");
  label.classList.add("toggle-switch");

  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = article.isActive;

  input.addEventListener("change", () => {
    const inputFindIndex = cartArticles.findIndex(
      (item) => item.name === article.name
    );

    if (inputFindIndex !== -1) {
      cartArticles[inputFindIndex].isActive =
        !cartArticles[inputFindIndex].isActive;
      displayArticle();
    }
  });

  const span = document.createElement("span");
  span.classList.add("toggle-slider");

  contentItemImage.appendChild(image);
  contentItemText.append(h2, p);
  extensionActions.append(btnRemove, label);
  btnRemove.appendChild(boutton);
  label.append(input, span);

  contentMainRow.append(contentItemImage, contentItemText);
  contentItem.append(contentMainRow, extensionActions);
  return contentItem;
};

fetchAllArticle();
