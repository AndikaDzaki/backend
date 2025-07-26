
import fetch from "node-fetch";

export const isTanggalMerah = async (tanggalISO) => {
  try {
    const res = await fetch("https://api-harilibur.vercel.app/api");
    const data = await res.json();

    return data.some((libur) => libur.date === tanggalISO);
  } catch (err) {
    console.error("Gagal cek tanggal merah dari API:", err.message);
    return false;
  }
};
