import prisma from "../config/prisma.js";

export const getAllSiswa = async (req, res) => {
  try {
    const siswa = await prisma.siswa.findMany({
      include: {
        kelas: {
          select: {
            nama_kelas: true,
          },
        },
      },
    });

    const hasil = siswa.map((s) => ({
      id: s.id,
      nama: s.nama,
      nisn: s.nisn,
      noTelp: s.noTelp,
      id_kelas: s.id_kelas,
      jenis_kelamin: s.jenis_kelamin,
      nama_kelas: s.kelas?.nama_kelas || null,
    }));

    res.status(200).json(hasil);
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

export const createSiswa = async (req, res) => {
  const { nama, nisn, id_kelas, noTelp, jenis_kelamin } = req.body;

  if (!nama || !nisn || !id_kelas || !jenis_kelamin) {
    return res.status(400).json({ Error: "Nama, NISN, kelas, dan jenis kelamin wajib diisi" });
  }

  try {
    const siswa = await prisma.siswa.create({
      data: {
        nama,
        nisn,
        id_kelas,
        noTelp,
        jenis_kelamin, 
      },
    });
    res.status(201).json({ message: "Siswa berhasil ditambahkan", id: siswa.id });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

export const updateSiswa = async (req, res) => {
  const { id } = req.params;
  const { nama, nisn, id_kelas, noTelp, jenis_kelamin } = req.body;

  try {
    await prisma.siswa.update({
      where: { id: parseInt(id) },
      data: {
        nama,
        nisn,
        id_kelas,
        noTelp,
        jenis_kelamin, 
      },
    });
    res.json({ message: "Data siswa berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};

export const deleteSiswa = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.siswa.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Data siswa berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ Error: error.message });
  }
};
