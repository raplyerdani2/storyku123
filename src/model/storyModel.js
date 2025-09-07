import { getApi } from "./api/getApi.js";
import { postApi } from "./api/postApi.js";
import {
  clearStoriesIdb,
  getAllStoriesIdb,
  getDetailStoryIdb,
  saveDetailStoryIdb,
  saveStoryIdb,
} from "../utils/db.js";

export class StoryModel {
  async getStories(token) {
    try {
      const data = await getApi.getStories("https://story-api.dicoding.dev/v1", token);
      if (data?.listStory) {
        await clearStoriesIdb();
        for (const story of data.listStory) {
          await saveStoryIdb(story);
        }
      }
      return data.listStory;
    } catch (error) {
      console.warn("Gagal ambil API, fallback ke IndexedDB:", error);
      return await getAllStoriesIdb();
    }
  }

  async getStoryById(id, token) {
    try {
      const data = await getApi.getDetailStories(
        "https://story-api.dicoding.dev/v1",
        id,
        token
      );
      if (data?.story) {
        await saveDetailStoryIdb(data.story);
      }
      return data.story;
    } catch (error) {
      console.warn(`Gagal ambil detail story ${id}, fallback ke IndexedDB`);
      return await getDetailStoryIdb(id);
    }
  }

  async register({ name, email, password }) {
    return postApi.register({
      url: "https://story-api.dicoding.dev/v1",
      name,
      email,
      password,
    });
  }

  async login({ email, password }) {
    return postApi.login({
      url: "https://story-api.dicoding.dev/v1",
      email,
      password,
    });
  }

  async addStory(data, token) {
    return postApi.addStory("https://story-api.dicoding.dev/v1", data, token);
  }
}
