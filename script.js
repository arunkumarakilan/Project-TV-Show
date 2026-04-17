// =================> DOM ELEMENTS
const displayPage = document.getElementById("display-page");
const searchInput = document.getElementById("input");
const select = document.getElementById("select");
const count = document.getElementById("count");

// =================> GLOBAL DATA
let allShows = [];
let allEpisodes = [];
const episodeCache = {};

// =================> STATE
const state = {
  searchTerm: "",
  //selectedEpisodeId: "",
};

// =================> FETCH ALL SHOWS
async function getAllShows() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    return await response.json();
  } catch (error) {
    alert("Something went wrong!");
    return [];
  }
}

// =================> FETCH EPISODES
async function getEpisodes(showId) {
  // 👉 if already fetched, return from cache
  if (episodeCache[showId]) {
    return episodeCache[showId];
  }

  try {
    const response = await fetch(
      `https://api.tvmaze.com/shows/${showId}/episodes`,
    );
    const data = await response.json();
    // 👉 store in cache
    episodeCache[showId] = data;
    return data;
  } catch (error) {
    alert("Something went wrong!");
    return [];
  }
}

// =================> CREATE ONE CARD
function createFilmCard(film) {
  const filmCard = document.getElementById("film-card").content.cloneNode(true);

  filmCard.querySelector("h3").textContent =
    `${film.name} S${String(film.season).padStart(2, "0")}E${String(
      film.number,
    ).padStart(2, "0")}`;

  filmCard.querySelector("img").src =
    film.image?.medium ||
    "https://placehold.co/400x225/1f2937/ffffff?text=No+Image";

  filmCard.querySelector("p").innerHTML =
    film.summary || "No summary available";

  return filmCard;
}

// =================> RENDER
function render(episodes) {
  displayPage.innerHTML = "";

  episodes.forEach((episode) => {
    displayPage.appendChild(createFilmCard(episode));
  });

  count.textContent = `Showing ${episodes.length} of ${allEpisodes.length} episodes`;
}

// =================> SEARCH
function handleSearch() {
  const value = searchInput.value.toLowerCase();
  state.searchTerm = value;

  const filtered = allEpisodes.filter((ep) => {
    return (
      ep.name.toLowerCase().includes(value) ||
      (ep.summary && ep.summary.toLowerCase().includes(value))
    );
  });

  render(filtered);
}

// =================> SHOWS DROPDOWN
function populateShowsDropdown() {
  select.innerHTML = "";
  // placeholder option
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select a show ...";
  placeholder.disabled = true;
  placeholder.selected = true;

  select.appendChild(placeholder);

  const sortedShows = allShows.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
  );

  sortedShows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    select.appendChild(option);
  });
}

// =================> SHOW CHANGE
async function handleShowChange() {
  const showId = select.value;

  allEpisodes = await getEpisodes(showId);

  searchInput.value = "";
  state.searchTerm = "";

  render(allEpisodes);
}

// =================> SETUP
async function setup() {
  const root = document.getElementById("root");
  const container = document.getElementById("container");

  container.style.display = "none";

  const loadingMessage = document.createElement("h1");
  loadingMessage.textContent = "Loading...";
  root.appendChild(loadingMessage);

  // 1. LOAD SHOWS
  allShows = await getAllShows();

  // 2. POPULATE SHOW DROPDOWN
  populateShowsDropdown();

  // 3. LOAD FIRST SHOW EPISODES
  const firstShowId = allShows[0].id;
  allEpisodes = await getEpisodes(firstShowId);

  // 4. RENDER
  render(allEpisodes);

  container.style.display = "flex";
  root.removeChild(loadingMessage);
}

// =================> EVENTS
searchInput.addEventListener("input", handleSearch);
select.addEventListener("change", handleShowChange);

window.onload = setup;
