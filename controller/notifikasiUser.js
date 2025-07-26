import prisma from "../config/prisma.js";


export const getNotifikasiUser = async (req, res) => {
  const guruId = parseInt(req.params.id);

  if (isNaN(guruId)) {
    return res.status(400).json({ message: "ID guru tidak valid" });
  }

  try {
    const notifikasi = await prisma.notifikasi_user.findMany({
      where: { id_guru: guruId }, 
      orderBy: { tanggal: "desc" },
    });

    res.json(notifikasi);
  } catch (error) {
    console.error("Gagal ambil notifikasi:", error);
    res.status(500).json({ message: "Gagal ambil notifikasi", error });
  }
};

export const tandaiNotifikasi = async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID notifikasi tidak valid" });
  }

  try {
    const updated = await prisma.notifikasi_user.update({
      where: { id },
      data: { dibaca: true },
    });

    res.json(updated);
  } catch (error) {
    console.error("Gagal tandai notifikasi:", error);
    res.status(500).json({ message: "Gagal menandai notifikasi", error });
  }
};


export const hapusNotifikasi = async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID notifikasi tidak valid" });
  }

  try {
    await prisma.notifikasi_user.delete({
      where: { id },
    });

    res.json({ message: "Notifikasi berhasil dihapus" });
  } catch (error) {
    console.error("Gagal hapus notifikasi:", error);
    res.status(500).json({ message: "Gagal menghapus notifikasi", error });
  }
};


export const generateNotifikasi = async () => {
  
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));

  const todayStr = startOfDay.toISOString().split("T")[0]; 

  try {
    const jadwalHariIni = await prisma.jadwal.findMany({
      where: {
        tanggal: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        kelas: {
          include: {
            guru: true,
          },
        },
      },
    });

    console.log("Jumlah jadwal ditemukan:", jadwalHariIni.length);

    const notifikasiSet = new Set();

    for (const jadwal of jadwalHariIni) {
      const guruId = jadwal.kelas?.id_guru;
      const namaKelas = jadwal.kelas?.nama_kelas;

      if (!guruId || !namaKelas) {
        console.log("Lewat karena tidak ada guruId/namaKelas:", jadwal);
        continue;
      }

      const key = `${guruId}-${namaKelas}-${todayStr}`;
      if (notifikasiSet.has(key)) continue;

      notifikasiSet.add(key);

      console.log("Buat notifikasi untuk:", guruId, namaKelas);

      await prisma.notifikasi_user.create({
        data: {
          id_guru: guruId,
          pesan: `Anda memiliki jadwal hari ini untuk kelas ${namaKelas} pukul ${jadwal.jam_mulai}`,
        },
      });
    }

    console.log("✅ Notifikasi guru berhasil digenerate dari jadwal.");
  } catch (error) {
    console.error("❌ Gagal generate notifikasi guru dari jadwal:", error.message, error);
  }
};

