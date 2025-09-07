export const getShow = {
  showStories: async (model, view, token) => {
    const stories = await model.getStories(token);
    view.renderStories(stories || []);
  },

  showDetail: async (model, view, token, id) => {
    const story = await model.getStoryById(id, token);
    if (story) {
      view.renderDetail(story);
    } else {
      console.error("Detail story tidak ditemukan di API & IDB");
      view.renderDetail(null);
    }
  }
};
