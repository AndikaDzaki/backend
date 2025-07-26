import cron from "node-cron";
import { generateNotifikasi } from "../controller/notifikasiUser.js";

function getCurrentJakartaTime() {
  const now = new Date();
  return new Date(now.getTime() + 7 * 60 * 60 * 1000).toISOString().replace("T", " ").substring(0, 19);
}

cron.schedule(
  "0 7 * * *",
  async () => {
    const now = getCurrentJakartaTime();
    console.log(`[CRON] generateNotifikasiService dijalankan pada ${now}`);

    try {
      await generateNotifikasi();
      console.log(`[CRON] generateNotifikasiService selesai dijalankan pada ${now}`);
    } catch (error) {
      console.error(`[CRON ERROR] Gagal menjalankan generateNotifikasiService pada ${now}`, error);
    }
  },
  {
    timezone: "Asia/Jakarta",
  }
);
