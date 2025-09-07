import { getAllFavoriteStoriesIdb, deleteFavoriteStoryIdb } from "../../utils/db.js";

export const favoritePage = async (root) => {
  const favorites = await getAllFavoriteStoriesIdb();

  root.innerHTML = `
    <div>
      <h2 style="text-align:center">Favorite Stories</h2>
      <div id="favoriteContainer" style="display: grid; gap: 15px;">
        ${
          favorites.length > 0
            ? favorites
                .map(
                  (s) => `
                  <div class="fav-card">
                    <img src="${s.photoUrl}" alt="${s.name}" width="200">
                    <h3>${s.name}</h3>
                    <p>${s.description}</p>
                    <button class="delete-fav" data-id="${s.id}">❌ Hapus</button>
                  </div>
                `
                )
                .join("")
            : `<p style="text-align:center">Belum ada story favorit</p>`
        }
      </div>
    </div>
  `;

  // Hapus favorite story
  const deleteBtns = document.querySelectorAll(".delete-fav");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      await deleteFavoriteStoryIdb(id);
      alert("Story dihapus dari Favorite!");
      window.location.reload();
    });
  });
};
