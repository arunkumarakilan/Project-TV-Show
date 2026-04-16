// === DOM elements ===
const displayPage = document.getElementById("display-page");
const searchInput = document.getElementById("input");
const select = document.getElementById("select");
const count = document.getElementById("count");

// === global data ===
let allEpisodes = [];

// === fetch API ===
async function getEpisodes() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
    return await response.json();
  } catch (error) {
    alert("Something went wrong!");
    return [];
  }
}

// === create ONE episode card ===
function createFilmCard(film) {
  const filmCard = document.getElementById("film-card").content.cloneNode(true);

  filmCard.querySelector("h3").textContent =
    `${film.name} S${String(film.season).padStart(2, "0")}E${String(
      film.number,
    ).padStart(2, "0")}`;

  filmCard.querySelector("img").src = film.image.medium;
  filmCard.querySelector("p").innerHTML = film.summary;

  return filmCard;
}

// === render function ===
function render(episodes) {
  displayPage.innerHTML = "";

  episodes.forEach((episode) => {
    displayPage.appendChild(createFilmCard(episode));
  });
  count.textContent = `Showing ${episodes.length} of ${allEpisodes.length} episodes`;
}

// SEARCH FUNCTION

function handleSearch() {
  const value = searchInput.value.toLowerCase();

  const filtered = allEpisodes.filter((ep) => {
    return (
      ep.name.toLowerCase().includes(value) ||
      ep.summary.toLowerCase().includes(value)
    );
  });

  render(filtered);
}

// DROPDOWN POPULATION

function populateDropdown() {
  select.innerHTML = "";

  // default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "Show all episodes";
  select.appendChild(defaultOption);

  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");

    option.value = episode.id;
    option.textContent = `S${String(episode.season).padStart(
      2,
      "0",
    )}E${String(episode.number).padStart(2, "0")} - ${episode.name}`;

    select.appendChild(option);
  });
}

// DROPDOWN CHANGE;
function handleDropdown() {
  const value = select.value;

  if (value === "all") {
    render(allEpisodes);
    return;
  }

  const selected = allEpisodes.filter((ep) => ep.id == value);

  render(selected);
}

// === setup
async function setup() {
  const root = document.getElementById("root");
  const container = document.getElementById("container");

  container.style.display = "none";

  const loadingMessage = document.createElement("h1");
  loadingMessage.textContent = "Loading...";
  root.appendChild(loadingMessage);

  allEpisodes = await getEpisodes();

  render(allEpisodes);
  populateDropdown();

  container.style.display = "flex";
  root.removeChild(loadingMessage);
}

// === EVENT LISTENERS ===
searchInput.addEventListener("input", handleSearch);
select.addEventListener("change", handleDropdown);

window.onload = setup;
