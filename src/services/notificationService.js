import { askNotificationPermission, subscribeUser } from "../index.js";

export const notificationService = {
  async registerAndSubscribe() {
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        console.warn("Service Worker belum terdaftar.");
        return false;
      }

      const permission = await askNotificationPermission();
      if (permission === "granted") {
        await subscribeUser(reg);
        console.log("Push Notification berhasil diaktifkan.");
        return true;
      } else {
        console.warn("Izin Push Notification ditolak.");
        return false;
      }
    } catch (error) {
      console.error("Gagal mengatur push notification:", error);
      return false;
    }
  },
};
