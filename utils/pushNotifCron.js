import cron from 'node-cron';
import { kirimNotifikasiAbsensi } from '../services/PushNotification.js';


cron.schedule('0 7 * * *', async () => {
  console.log('⏰ Cron: Mengirim notifikasi absensi...');
  await kirimNotifikasiAbsensi();
});
