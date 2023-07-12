const API_KEY = "1bc5ba53538944fbba86d01b8f7724e1";
const url = "https://newsapi.org/v2/everything?q=";
const DATE = new Date();
const TODAY = DATE.toISOString().split('T')[0];
const lastWeek = DATE.setUTCDate(1);
let QUERY = 'Egypt'
let currentUrl = "";

// Fetch news on page load
window.addEventListener("load", () => fetchNews(QUERY));

// Reload the page
function reload() {
    window.location.reload();
}

// Fetch news data from the API
async function fetchNews(query, sortBy = 'publishedAt') {
    currentUrl = `${url}${query}&from=${lastWeek}&to=${TODAY}&sortBy=${sortBy}&language=en&apiKey=${API_KEY}`;
    const res = await fetch(currentUrl);
    const data = await res.json();
    bindData(data.articles);
}

// Bind the fetched news data to the UI
function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        if (article.url.includes('https://www.aljazeera.com')) return; //aljazeera website is forbidden in Egypt
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    // Retrieve the necessary elements within the cardClone
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    // Fill the data from the article into the corresponding elements
    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    // Format and display the news source and publishing date
    const date = new Date(article.publishedAt).toLocaleString("en-BG", {
        timeZone: "Africa/Cairo",
    });
    newsSource.innerHTML = `${article.source.name} · ${date}`;

    // Open the full article in a new tab when the card is clicked
    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// Function to handle the click event on the navigation items
let curSelectedNav = null;
function onNavItemClick(id) {
    QUERY = id;
    fetchNews(id);

    // Update the active state of the navigation item
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

// Event listener for the search button click
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");
searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    QUERY = query;
    fetchNews(query);

    // Clear the active state of the navigation item
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

// Event listener for the sorting select box change
const sortingSelect = document.getElementById("sort-box");
sortingSelect.addEventListener("change", handleSorting);

function handleSorting() {
    // Fetch news based on the selected sorting option
    const selectedValue = sortingSelect.value;
    fetchNews(QUERY, selectedValue);
}