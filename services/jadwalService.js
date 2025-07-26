import prisma from "../config/prisma.js";

export const generateJadwalOtomatisService = async () => {
  try {
    const kelasList = await prisma.kelas.findMany({
      include: {
        guru: true,
      },
    });

    if (kelasList.length === 0) {
      throw new Error("Data kelas kosong.");
    }

    const tanggalHariIni = new Date();
    const totalHariGenerate = 5;
    const jamMulai = "08:00";
    const jamSelesai = "09:00";

    const jadwalData = [];

    for (let i = 0; i < totalHariGenerate; i++) {
      const currentDate = new Date(tanggalHariIni);
      currentDate.setDate(currentDate.getDate() + i);

      
      if (currentDate.getDay() === 0) continue;

      kelasList.forEach((kelas) => {
        if (!kelas.guru) return; 

        const tanggalStr = formatTanggalOnly(currentDate);
        const jamMulaiObj = new Date(`${tanggalStr}T${jamMulai}:00`);
        const jamSelesaiObj = new Date(`${tanggalStr}T${jamSelesai}:00`);

        jadwalData.push({
          id_guru: kelas.guru.id,
          id_kelas: kelas.id,
          tanggal: currentDate,
          jam_mulai: jamMulaiObj,
          jam_selesai: jamSelesaiObj,
        });
      });
    }

   
    const uniqueSet = new Set();
    const finalData = [];

    jadwalData.forEach((item) => {
      const key = `${item.id_guru}_${item.id_kelas}_${item.tanggal.toISOString()}_${item.jam_mulai.toISOString()}`;
      if (!uniqueSet.has(key)) {
        uniqueSet.add(key);
        finalData.push(item);
      }
    });

    await prisma.jadwal.createMany({ data: finalData, skipDuplicates: true, });

    console.log("Generate jadwal otomatis berhasil.");
  } catch (error) {
    console.error("[GENERATE JADWAL OTOMATIS ERROR]", error);
    throw error;
  }
};

function formatTanggalOnly(date) {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}
