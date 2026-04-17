//=> store data in single location
const state = { film:[], searchTerm: "", selectTerm: "" };
//=> display episode count 
function displayCount() {
  const rootElem = document.getElementById("display");
  rootElem.textContent = `Displaying ${filteredFilmCards().length}/${state.film.length} episodes`;
}
//=> fetch API
 async function fetchEpisode() {
     try
     {
      const response = await fetch("https://api.tvmaze.com/shows/82/episodes")
      if(!response.ok)
      {
        throw new Error (`HTTP error! status:${response.status}`);
      }
      const films = await response.json();
      return films;
     }
     catch(error){
         const root = document.getElementById("root");

         root.innerHTML = `
    <div style="
      text-align:center;
      padding:30px;
      background:white;
      border-radius:12px;
      max-width:400px;
      margin:40px auto;
      box-shadow:0 10px 20px rgba(0,0,0,0.1);
    ">
      <h2>❌ Failed to load</h2>
      <p>Unable to fetch episodes.</p>
      <button id="retryBtn">🔄 Retry</button>
    </div>
  `;

         // 👉 retry logic
         document.getElementById("retryBtn").addEventListener("click", () => {
           root.textContent = "Loading episodes...";
           fetchEpisode().then((films) => {
             if (!films) return;
             state.film = films;
             render();
           });
         });
      console.error("Error fetching films:",error);
     }
 };
 fetchEpisode().then((films)=>{
  if(!films)return;
  state.film = films;
  render();
 })

//=> create film card for one episode 
function createFilmCard(film) {
  const filmCard = document.getElementById("film-card").content.cloneNode(true);
  filmCard.querySelector("h3").textContent =
    `${film.name}S${film.season.toString().padStart(2, "0")}E${film.number.toString().padStart(2, "0")}`;
  filmCard.querySelector("img").src = film.image.medium;
  filmCard.querySelector("p").innerHTML = film.summary;
  return filmCard;
}
//=> filter function for search and select
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
//=> create episode list for select drop down
function createEpisodeList(film) {
  const episodeList = document.createElement("option");
  episodeList.textContent = `S${film.season.toString().padStart(2, "0")}E${film.number.toString().padStart(2, "0")}-${film.name}`;
  return episodeList;
}
//=> render function for render the UI
function render() {
  const episodeList = state.film.map(createEpisodeList);
  document.getElementById("select").append(...episodeList);
  const filmCard = filteredFilmCards().map(createFilmCard);
  document.getElementById("root").innerHTML = "";
  document.getElementById("root").append(...filmCard);
  displayCount(state.film);
}
render();
//=> event listener for select and search
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
