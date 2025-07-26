import  prisma  from "../config/prisma.js";

export const getAllKelas = async (req, res) => {
  try {
    const kelas = await prisma.kelas.findMany({
      include: {
        guru: {
          select: { namaGuru: true },
        },
      },
    });
    
    
    res.status(200).json(kelas);
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

export const createKelas = async (req, res) => {
  const { nama_kelas, id_guru } = req.body;

  if (!nama_kelas || !id_guru) {
    return res.status(400).json({ Error: "Nama Kelas dan ID guru wajib diisi" });
  }

  try {
    const newKelas = await prisma.kelas.create({
      data: {
        nama_kelas,
        guru: {
          connect: { id: Number(id_guru) },
        },
      },
    });
    res.status(201).json({ message: "Kelas berhasil ditambahkan", id: newKelas.id });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

export const updateKelas = async (req, res) => {
  const { id } = req.params;
  const { nama_kelas, id_guru } = req.body;

  try {
    await prisma.kelas.update({
      where: { id: Number(id) },
      data: {
        nama_kelas,
        guru: {
          connect: { id: Number(id_guru) },
        },
      },
    });
    res.json({ message: "Kelas berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

export const deleteKelas = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.kelas.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Kelas berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};



export const getKelasByGuru = async (req, res) => {

  const idGuru = parseInt(req.query.id);

  if (!idGuru) {
    return res.status(400).json({ message: "ID guru " });
  }

  try {
    const kelas = await prisma.kelas.findFirst({
      where: { id_guru: idGuru },
      include: {
        guru: true,
      },
    });

    if (!kelas) {
      return res.status(404).json({ message: "Guru belum punya kelas" });
    }

    const jumlahSiswa = await prisma.siswa.count({
      where: { id_kelas: kelas.id },
    });

    return res.json({
      id: kelas.id,
      nama_kelas: kelas.nama_kelas,
      jumlah_siswa: jumlahSiswa,
      namaGuru: kelas.guru?.namaGuru || "-",
    });
  } catch (error) {
    console.error("Gagal mengambil kelas:", error);
    return res.status(500).json({ message: "Terjadi kesalahan saat mengambil kelas" });
  }
};

