import webPush from '../utils/web-push.js';
import prisma from '../config/prisma.js';

export const kirimNotifikasiAbsensi = async () => {
  const payload = JSON.stringify({
    title: 'Absensi Dibuka',
    body: 'Silakan isi absensi hari ini!',
  });

  try {
    const subs = await prisma.pushSubscription.findMany();

    const results = await Promise.allSettled(
      subs.map((sub, i) =>
        webPush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: sub.keys,
          },
          payload
        ).catch((err) => {
          console.error('❌ Gagal kirim ke subscriber', i, err);
        })
      )
    );

    console.log('✅ Notifikasi otomatis dikirim');
    return results;
  } catch (err) {
    console.error('❌ Gagal kirim notifikasi:', err);
    throw err;
  }
};