//You can edit ALL of the code here
const state = { film: getAllEpisodes(), searchTerm: "", selectTerm: "" };
function makePageForEpisodes() {
  const rootElem = document.getElementById("display");
  rootElem.textContent = `Displaying ${filteredFilmCards().length}/${state.film.length} episodes`;
}

function createFilmCard(film) {
  const filmCard = document.getElementById("film-card").content.cloneNode(true);
  filmCard.querySelector("h3").textContent =
    `${film.name}S${film.season.toString().padStart(2, "0")}E${film.number.toString().padStart(2, "0")}`;
  filmCard.querySelector("img").src = film.image.medium;
  filmCard.querySelector("p").innerHTML = film.summary;
  return filmCard;
}
function filteredFilmCards() {
  return state.film.filter((film) => {
    const code = `${film.name}S${film.season.toString().padStart(2, "0")}E${film.number.toString().padStart(2, "0")}`;

    const searchInputMatch =
      code.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      film.summary.toLowerCase().includes(state.searchTerm.toLowerCase());
    const selectInputMatch =
      `S${film.season.toString().padStart(2, "0")}E${film.number.toString().padStart(2, "0")}-${film.name}` ===
        state.selectTerm || state.selectTerm === "";
    return searchInputMatch && selectInputMatch;
  });
}

function createEpisodeList(film) {
  const episodeList = document.createElement("option");
  episodeList.textContent = `S${film.season.toString().padStart(2, "0")}E${film.number.toString().padStart(2, "0")}-${film.name}`;
  return episodeList;
}
function render() {
  const episodeList = state.film.map(createEpisodeList);
  document.getElementById("select").append(...episodeList);
  const filmCard = filteredFilmCards().map(createFilmCard);
  document.getElementById("root").innerHTML = "";
  document.getElementById("root").append(...filmCard);
  makePageForEpisodes(state.film);
}
render();

const input = document.getElementById("search");
input.addEventListener("keyup", () => {
  state.searchTerm = input.value;
  document.getElementById("root").innerHTML = "";
  render();
});
const select = document.getElementById("select");
select.addEventListener("change", () => {
  state.selectTerm = select.value;
  render();
});
