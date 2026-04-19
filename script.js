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
}
function displayShowCount() {
  const displayShowCount = document.getElementById("display-show-count");
  displayShowCount.textContent = `Displaying ${filteredShowCards().length}/${state.shows.length} shows`;
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
  cardElement.querySelector("#genre").textContent = `Genres: ${show.genres}`;
  cardElement.querySelector("#status").textContent = `Status: ${show.status}`;
  cardElement.querySelector("#rating").textContent =
    `Rating: ${show.rating.average}`;
  cardElement.querySelector("#runtime").textContent =
    `Runtime: ${show.runtime}`;
  cardElement.addEventListener("click", () => {
    showEpisode.style.display = "none";
    document.getElementById("show-list").style.display = "none";
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
  return (filteredShow = state.shows.filter((show) => {
    const selectShow =
      show.name === state.selectShow || state.selectShow === "";
    const searchShow = show.name
      .toLowerCase()
      .includes(state.showSearch.toLowerCase());
    return selectShow && searchShow;
  }));
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
  document.getElementById("search").style.display = "none";
  document.getElementById("select").style.display = "none";
  document.getElementById("view-all-shows").style.display = "none";
  displayShowCount(state.shows);
}
//=> render function for render the UI
function render() {
  const episodeList = state.episodes.map(createEpisodeList);
  document.getElementById("select").append(...episodeList);
  const episodeCard = filteredEpisodeCards().map(createEpisodeCard);
  document.getElementById("root").innerHTML = "";
  document.getElementById("root").append(...episodeCard);
  document.getElementById("select").style.display = "grid";
  document.getElementById("search").style.display = "grid";
  document.getElementById("show-search").style.display = "none";
  document.getElementById("display-show-count").style.display = "none";
  document.getElementById("display-episode-count").style.display = "block";
  document.getElementById("view-all-shows").style.display = "grid";
  displayEpisodeCount(state.episodes);
}
//=> search listener
const input = document.getElementById("search");
input.addEventListener("keyup", () => {
  state.searchTerm = input.value;
  document.getElementById("root").innerHTML = "";
  render();
});
//=> select drop-down listener
const select = document.getElementById("select");
select.addEventListener("change", () => {
  state.selectTerm = select.value;
  render();
});
//=> search listener for shows....
const searchShow = document.getElementById("show-search");
searchShow.addEventListener("keyup", () => {
  state.showSearch = searchShow.value;
  showRender();
});
//=> select drop down listener for shows
const selectShow = document.getElementById("show-list");
selectShow.addEventListener("change", () => {
  state.selectShow = selectShow.value;
  document.getElementById("display-episode-count").style.display = "none";
  document.getElementById("show-container").style.display = "grid";
  showRender();
});
//=> view All show listener
const viewAllShows = document.getElementById("view-all-shows");
viewAllShows.addEventListener("click", () => {
  document.getElementById("root").innerHTML = "";
  document.getElementById("show-container").style.display = "grid";
  document.getElementById("display-show-count").style.display = "block";
  document.getElementById("display-episode-count").style.display = "none";
  document.getElementById("show-search").style.display = "block";
  document.getElementById("show-list").style.display = "block";
  showRender();
});

window.onload = setup;
