const state = {
  shows: [],
  episodes: [],
  searchTerm: "",
  selectTerm: "",
  selectShow: "",
  showId: "",
  showSearch: "",
};

const showEpisode = document.getElementById("show-container");

//=> display episode count
function displayEpisodeCount() {
  const rootElem = document.getElementById("display-episode-count");
  rootElem.textContent = `Displaying ${filteredEpisodeCards().length}/${state.episodes.length} episodes`;
  //rootElem.textContent = `Displaying ${filteredShowCards().length}/${state.shows.length} episodes`;
}
function setup() {
  async function fetchShow() {
    try {
      const response = await fetch("https://api.tvmaze.com/shows");
      if (!response.ok) {
        throw new Error(`HTTP error! status:${response.status}`);
      }
      const shows = await response.json();
      state.shows = shows;
      showRender();
      return shows;
    } catch (error) {
      const root = document.getElementById("root");
      root.innerHTML = `<div style="
     text-align:center;
     padding:30px;
     background:white;
     border-radius:12px;
     max-width:400px;
     margin:40px auto;
     box-shadow:0 10px 20px rgba(0,0,0,0.1);
   ">
     <h2> ❌  Failed to load</h2>
     <p>Unable To Fetch the Show</p>
     <button id="retryBtn">🔄 Retry</button>
     </div>`;

      document.getElementById("retryBtn").addEventListener("click", () => {
        root.innerHTML = "loading shows.....";
        setup();
        showRender();
      });
      console.error("Error fetching films:", error);
    }
  }

  fetchShow();
}
//=> fetch API

function episodeSource() {
  async function fetchEpisode() {
    try {
      const response = await fetch(
        `https://api.tvmaze.com/shows/${state.showId}/episodes`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status:${response.status}`);
      }
      const episodes = await response.json();
      state.episodes = episodes;
      render();
      return episodes;
    } catch (error) {
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
          state.episodes = episodes;
          render();
        });
      });
      console.error("Error fetching films:", error);
    }
  }
  fetchEpisode();
}
//=>create show card for one show
function createShowCard(show) {
  const showCard = document.getElementById("show-card").content.cloneNode(true);
  const cardElement = showCard.querySelector(".card");
  cardElement.querySelector("h3").textContent = show.name;
  cardElement.querySelector("img").src = show.image.medium;
  cardElement.querySelector("p").innerHTML = show.summary;
  cardElement.addEventListener("click", () => {
    showEpisode.style.display = "none";
    state.showId = show.id;
    episodeSource();
  });
  return cardElement;
}

//=> create episode card for one episode
function createEpisodeCard(episode) {
  const episodeCard = document
    .getElementById("episode-card")
    .content.cloneNode(true);
  episodeCard.querySelector("h3").textContent =
    `${episode.name}S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
  episodeCard.querySelector("img").src = episode.image.medium;
  episodeCard.querySelector("p").innerHTML = episode.summary;
  return episodeCard;
}
//=>
function filteredShowCards() {
  filteredShow = state.shows.filter((show) => {
    return show.name === state.selectShow || state.selectShow === "";
  });
  return filteredShow;
}
//=> filter function for search and select
function filteredEpisodeCards() {
  return state.episodes.filter((episodes) => {
    const code = `${episodes.name}S${episodes.season.toString().padStart(2, "0")}E${episodes.number.toString().padStart(2, "0")}`;

    const searchInputMatch =
      code.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      episodes.summary.toLowerCase().includes(state.searchTerm.toLowerCase());
    const selectInputMatch =
      `S${episodes.season.toString().padStart(2, "0")}E${episodes.number.toString().padStart(2, "0")}-${episodes.name}` ===
        state.selectTerm || state.selectTerm === "";
    return searchInputMatch && selectInputMatch;
  });
}
//=> Create show list for select drop down
function createShowList(show) {
  const showList = document.createElement("option");
  showList.textContent = show.name;
  return showList;
}
//=> create episode list for select drop down
function createEpisodeList(episode) {
  const episodeList = document.createElement("option");
  episodeList.textContent = `S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}-${episode.name}`;
  return episodeList;
}
//=> render function for render the show
function showRender() {
  const showList = state.shows
    .sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    })
    .map(createShowList);
  document.getElementById("show-list").append(...showList);
  const showCard = filteredShowCards()
    .sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    })
    .map(createShowCard);
  document.getElementById("show-container").innerHTML = "";
  document.getElementById("show-container").append(...showCard);
  displayCount(state.shows);
}
//=> render function for render the UI
function render() {
  const episodeList = state.episodes.map(createEpisodeList);
  document.getElementById("select").append(...episodeList);
  const episodeCard = filteredEpisodeCards().map(createEpisodeCard);
  document.getElementById("root").innerHTML = "";
  document.getElementById("root").append(...episodeCard);
  displayCount(state.episodes);
}
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
const selectShow = document.getElementById("show-list");
selectShow.addEventListener("change", () => {
  state.selectShow = selectShow.value;
  showRender();
});
window.onload = setup;
