//=> store data in single location
const state = { episode:[], searchTerm: "", selectTerm: "" };
//=> display episode count 
function displayCount() {
  const rootElem = document.getElementById("display");
  rootElem.textContent = `Displaying ${filteredEpisodeCards().length}/${state.episode.length} episodes`;
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
      const episodes = await response.json();
      return episodes;
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
           fetchEpisode().then((episodes) => {
             if (!episodes) return;
             state.episode = episodes;
             render();
           });
         });
      console.error("Error fetching films:",error);
     }
 };
 fetchEpisode().then((episodes)=>{
  if(!episodes)return;
  state.episode = episodes;
  render();
 })

//=> create film card for one episode 
function createEpisodeCard(episode) {
  const episodeCard = document.getElementById("film-card").content.cloneNode(true);
  episodeCard.querySelector("h3").textContent =
    `${episode.name}S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
  episodeCard.querySelector("img").src = episode.image.medium;
  episodeCard.querySelector("p").innerHTML = episode.summary;
  return episodeCard;
}
//=> filter function for search and select
function filteredEpisodeCards() {
  return state.episode.filter((episode) => {
    const code = `${episode.name}S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;

    const searchInputMatch =
      code.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      episode.summary.toLowerCase().includes(state.searchTerm.toLowerCase());
    const selectInputMatch =
      `S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}-${episode.name}` ===
        state.selectTerm || state.selectTerm === "";
    return searchInputMatch && selectInputMatch;
  });
}
//=> create episode list for select drop down
function createEpisodeList(episode) {
  const episodeList = document.createElement("option");
  episodeList.textContent = `S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}-${episode.name}`;
  return episodeList;
}
//=> render function for render the UI
function render() {
  const episodeList = state.episode.map(createEpisodeList);
  document.getElementById("select").append(...episodeList);
  const episodeCard = filteredEpisodeCards().map(createEpisodeCard);
  document.getElementById("root").innerHTML = "";
  document.getElementById("root").append(...episodeCard);
  displayCount(state.episode);
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
