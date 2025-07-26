import cron from "node-cron";
import { generateAbsensiHarianService } from "../services/absensiService.js";

cron.schedule(
  "0 6 * * *",
  async () => {
    const now = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
    console.log(`[CRON] Menjalankan generateAbsensiHarian pada ${now}`);

    try {
      const result = await generateAbsensiHarianService();
      console.log("[CRON] Result:", result.message);
    } catch (error) {
      console.error("Cron job gagal:", error.message);
    }
  },
  {
    timezone: "Asia/Jakarta",
  }
);
