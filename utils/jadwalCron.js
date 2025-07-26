import cron from "node-cron";
import { generateJadwalOtomatisService } from "../services/jadwalService.js";

function getCurrentJakartaTime() {
  const now = new Date();
  return new Date(now.getTime() + 7 * 60 * 60 * 1000).toISOString().replace("T", " ").substring(0, 19);
}

cron.schedule(
  "0 0 * * *",
  async () => {
    const now = getCurrentJakartaTime();
    console.log(`[CRON] generateJadwalOtomatisService dijalankan pada ${now}`);

    try {
      await generateJadwalOtomatisService();
      console.log(`[CRON] generateJadwalOtomatisService selesai dijalankan pada ${now}`);
    } catch (error) {
      console.error(`[CRON ERROR] Gagal menjalankan generateJadwalOtomatisService pada ${now}`, error);
    }
  },
  {
    timezone: "Asia/Jakarta",
  }
);
