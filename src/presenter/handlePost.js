import { notificationService } from "../services/notificationService.js";

export const handlePost = {
  handleRegister: async (model, view, formData) => {
    view.showLoading();
    try {
      const result = await model.register(formData);
      if (!result.error) {
        view.handleRegister()
      } else {
        view.showMessage(result.message);
        view.reload();
      }
    } catch (err) {
      alert(err);
    }
  },

  handleLogin: async (model, view, formData) => {
    view.showLoading();
    try {
      const result = await model.login(formData);
      if (!result.error) {
        view.handleLogin()
      } else {
        view.showMessage(result.message);
        view.reload();
      }
    } catch (err) {
      alert(err);
    }
  },

  handleAddStory: async (model, view, token, formData) => {
    view.showLoading();
    await notificationService.registerAndSubscribe();
    try {
      const res = await model.addStory(formData, token);
      if (res.error) {
        view.showMessage(res.message);
      } else {
        view.handleStoryAdded();
      }
    } catch (err) {
      alert(err);
    }
  },
};
