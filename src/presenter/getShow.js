import {
  clearStoriesIdb,
  getAllStoriesIdb,
  getDetailStoryIdb,
  saveDetailStoryIdb,
  saveStoryIdb,
} from "../utils/db.js";

export const getShow = {
  showStories: async (model, view, token) => {
    try {
      const data = await model.getStories(token);
      await clearStoriesIdb();
      data?.listStory.forEach(async (element) => await saveStoryIdb(element));
      view.renderStories(data.listStory || []);
    } catch {
      const dataIdb = await getAllStoriesIdb();
      view.renderStories(dataIdb || []);
    }
  },
  showDetail: async (model, view, token, id) => {
    try {
      const data = await model.getStoryById(id, token);
      if (data?.story) {
        await saveDetailStoryIdb(data.story);
      }
      view.renderDetail(data.story);
    } catch {
      const dataIdb = await getDetailStoryIdb(id);
      if (dataIdb) {
        view.renderDetail(dataIdb || null);
      } else {
        console.error("Detail story tidak ditemukan di IDB");
      }
    }
  },
};
