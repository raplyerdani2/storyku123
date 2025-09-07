import { addStoryPage } from "./page/addStoryPage.js";
import { detailStoriesPage } from "./page/detailStoriesPage.js";
import { loginPage } from "./page/loginPage.js";
import { registerPage } from "./page/registerPage.js";
import { storiesPage } from "./page/storiesPage.js";

export class StoryView {
  constructor(root) {
    this.root = root;
  }

  renderStories(stories) {
    return storiesPage(this.root, stories);
  }

  renderDetail(story) {
    return detailStoriesPage(this.root, story);
  }

  renderLogin(onSubmit) {
    return loginPage(this.root, onSubmit);
  }

  renderRegister(onSubmit) {
    return registerPage(this.root, onSubmit);
  }

  renderAddForm(onSubmit) {
    return addStoryPage(this.root, onSubmit);
  }

  showLoading() {
    this.root.innerHTML += `
    <div class="loadingContainer">
      <p class="loading"></p>
    </div>
  `;
  }

  showMessage(message) {
    alert(message);
  }

  navigate(path) {
    location.hash = path;
  }

  reload() {
    window.location.reload();
  }

  handleRegister() {
    alert("Registrasi berhasil.");
    window.location.hash = "/stories";
    window.location.reload();

    view.showMessage("Registrasi berhasil.");
    window.location.hash = "/login";
  }

  handleLogin() {
    alert("Login berhasil.");
    window.location.hash = "/stories";
    window.location.reload();
  }

  handleStoryAdded() {
    alert("Story berhasil ditambahkan!");
    window.location.hash = "/stories";
    window.location.reload();
  }
}
