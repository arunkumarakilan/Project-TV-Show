//You can edit ALL of the code here
const state = { film: getAllEpisodes() };
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}
function createFilmCard(film) {
  const filmCard = document.getElementById("film-card").content.cloneNode(true);
  filmCard.querySelector("h3").textContent =
    `${film.name}S${film.season.toString().padStart(2, "0")}E${film.number.toString().padStart(2, "0")}`;
  filmCard.querySelector("img").src = film.image.medium;
  filmCard.querySelector("p").innerHTML = film.summary;
  return filmCard;
}
function render() {
  const filmCard = state.film.map(createFilmCard);
  document.body.append(...filmCard);
}

render();

window.onload = setup;
