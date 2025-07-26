import prisma  from "../config/prisma.js";
import { mapStatusToEnum } from "../utils/statusMapper.js";

export const getAllTahunAjaran = async (req, res) => {
  try {
    const tahunAjaran = await prisma.tahun_ajaran.findMany({
      orderBy: {
        id: "desc",
      },
    });
    res.json(tahunAjaran);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};

export const createTahunAjaran = async (req, res) => {
  const { tahun_ajaran, status } = req.body;

  if (!tahun_ajaran || !status) {
    return res.status(400).json({ Error: "Field tidak boleh kosong" });
  }

  try {
    const result = await prisma.tahun_ajaran.create({
      data: {
        tahun_ajaran,
        status: mapStatusToEnum(status)
      },
    });

    res.status(201).json({
      message: "Tahun ajaran berhasil ditambahkan",
      id: result.id,
    });
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};

export const updateTahunAjaran = async (req, res) => {
  const { id } = req.params;
  const { tahun_ajaran, status } = req.body;

  try {
    await prisma.tahun_ajaran.update({
      where: { id: Number(id) },
      data: {
        tahun_ajaran,
        status: mapStatusToEnum(status)
      },
    });

    res.json({ message: "Tahun ajaran berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};

export const deleteTahunAjaran = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.tahun_ajaran.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Tahun ajaran berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};
