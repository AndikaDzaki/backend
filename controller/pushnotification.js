import { kirimNotifikasiAbsensi } from "../services/PushNotification.js";
import  prisma  from "../config/prisma.js";

export const saveSubscription = async (req, res) => {
  const subscription = req.body;

  if (!subscription || !subscription.endpoint || !subscription.keys) {
    return res.status(400).json({ message: 'Invalid subscription' });
  }

  try {
  
    const existing = await prisma.pushSubscription.findUnique({
      where: { endpoint: subscription.endpoint },
    });

    if (!existing) {
      await prisma.pushSubscription.create({
        data: {
          endpoint: subscription.endpoint,
          keys: subscription.keys,
        },
      });
      console.log('Subscription disimpan ke DB:', subscription.endpoint);
    } else {
      console.log('ℹ Subscription sudah ada:', subscription.endpoint);
    }

    res.status(201).json({ message: 'Subscription saved' });
  } catch (err) {
    console.error('❌ Gagal simpan subscription:', err);
    res.status(500).json({ message: 'Failed to save subscription' });
  }
};

export const sendNotification = async (req, res) => {
  try {
    const results = await kirimNotifikasiAbsensi();
    res.status(200).json({ message: 'Notifikasi dikirim ke semua subscriber', results });
  } catch (err) {
    res.status(500).json({ message: 'Gagal kirim notifikasi' });
  }
};