import { getAllStoriesIdb, saveFavoriteStoryIdb } from "../../utils/db.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export const storiesPage = async (root, stories) => {
  let allStories = stories;

  if (!stories || stories.length === 0) {
    console.log("Offline mode: ambil dari IndexedDB");
    allStories = await getAllStoriesIdb();
  }

  root.innerHTML = `
    <div id="storiesContainer">
      <div id="mapStories"></div>
      <h2 style="padding: 30px 0px 10px; text-align:center">Stories</h2>
        <div id="storiesContainer2">
          <div id="toContent" class="storiesContainerCard">
            ${allStories
              .map(
                (s) => `
                <div id="card-story" tabindex="0">
                  <a href="#/stories/${s.id}">
                    <div id="card-story-img">
                      <img src="${s.photoUrl}" alt="Nama akun ${s.name} dengan deskripsi ${s.description}"/>
                    </div>
                    <div style="display:flex; flex-direction: column; gap: 5px; font-weight: bold">
                      <h3>Nama: ${s.name}</h3>
                      <h3>Deskripsi: ${s.description}</h3>
                      <p>lat: ${s.lat}</p>
                      <p>lon:${s.lon}</p>
                    </div>
                  </a>
                  <button class="favorite-btn" data-id="${s.id}">❤️ Favorite</button>
                </div>
                `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;

  // === EVENT LISTENER UNTUK FAVORITE ===
  const favButtons = document.querySelectorAll(".favorite-btn");
  favButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      const story = allStories.find((s) => s.id === id);

      if (story) {
        await saveFavoriteStoryIdb(story);
        alert("Story ditambahkan ke Favorite!");

        // Redirect ke halaman Favorite
        window.location.hash = "#/favorite";
      }
    });
  });

  // === LEAFLET MAP ===
  const header = document.getElementById("header");
  const footer = document.getElementById("footer");
  header.style.display = "flex";
  footer.style.display = "flex";

  const myMap = L.map("mapStories").setView([0, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    crossOrigin: true,
  }).addTo(myMap);

  const markers = [];

  allStories.forEach((element) => {
    const lat = parseFloat(element.lat);
    const lon = parseFloat(element.lon);

    if (!isNaN(lat) && !isNaN(lon)) {
      const coor = [lat, lon];
      const marker = L.marker(coor).addTo(myMap);
      marker.bindPopup(`<b>${element.name}</b><br>${element.description}`);
      markers.push(coor);
    }
  });

  if (markers.length > 0) {
    myMap.fitBounds(markers);
  }
};
