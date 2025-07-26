import prisma from "../config/prisma.js";
import { isTanggalMerah } from "../utils/cekLibur.js";

export const generateAbsensiHarianService = async () => {
  const today = new Date();

  const wib = new Date(today.getTime() + 7 * 60 * 60 * 1000);
  wib.setUTCHours(0, 0, 0, 0);
  const tanggalStr = wib.toISOString().split("T")[0];
  const hari = wib.toLocaleDateString("id-ID", { weekday: "long" });

  if (hari === "Minggu" || (await isTanggalMerah(wib))) {
    console.log(`[ABSENSI] ${tanggalStr} adalah hari libur. Tidak generate absensi.`);
    return { skip: true, message: "Hari libur, tidak generate absensi." };
  }

  const semesterAktif = await prisma.semester.findFirst({
    where: { status: "Aktif" },
  });

  if (!semesterAktif) {
    throw new Error("Semester aktif tidak ditemukan");
  }

  const jadwalHariIni = await prisma.jadwal.findMany({
    where: { tanggal: new Date(tanggalStr) },
    include: { kelas: true, guru: true },
  });

  for (const jadwal of jadwalHariIni) {
    const siswaKelas = await prisma.siswa.findMany({
      where: { id_kelas: jadwal.id_kelas }, 
    });

    for (const siswa of siswaKelas) {
      const existing = await prisma.absensi.findFirst({
        where: {
          tanggal: new Date(tanggalStr),
          id_siswa: siswa.id,
          kelas_id: jadwal.id_kelas,
        },
      });

      if (!existing) {
        await prisma.absensi.create({
          data: {
            tanggal: new Date(tanggalStr),
            id_siswa: siswa.id,
            kelas_id: jadwal.id_kelas,
            status: "Belum",
          },
        });
      }
    }
  }

  return { success: true, message: "Absensi harian berhasil digenerate" };
};
