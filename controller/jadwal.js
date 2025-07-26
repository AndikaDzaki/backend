import prisma from "../config/prisma.js";
import { generateJadwalOtomatisService } from "../services/jadwalService.js";

function formatTanggalOnly(date) {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

function formatJamOnly(date) {
  const d = new Date(date);
  return d.toTimeString().split(" ")[0].substring(0, 5);
}

export const getAllJadwal = async (req, res) => {
  try {
    const jadwal = await prisma.jadwal.findMany({
      include: {
        guru: { select: { namaGuru: true } },
        kelas: { select: { nama_kelas: true } },
      },
    });

    const formatted = jadwal.map((row) => ({
      id: row.id,
      id_guru: row.id_guru,
      id_kelas: row.id_kelas,
      tanggal: formatTanggalOnly(row.tanggal),
      jam_mulai: formatJamOnly(row.jam_mulai),
      jam_selesai: formatJamOnly(row.jam_selesai),
      guru: { namaGuru: row.guru.namaGuru },
      kelas: { nama_kelas: row.kelas.nama_kelas },
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};

export const createJadwal = async (req, res) => {
  const { id_guru, id_kelas, tanggal, jam_mulai, jam_selesai } = req.body;

  if (!id_guru || !id_kelas || !tanggal || !jam_mulai || !jam_selesai) {
    return res.status(400).json({ Error: "Semua field wajib diisi" });
  }

  try {
    const tanggalObj = new Date(tanggal);
    const jamMulaiObj = new Date(`${tanggal}T${jam_mulai}:00`);
    const jamSelesaiObj = new Date(`${tanggal}T${jam_selesai}:00`);

    const jadwal = await prisma.jadwal.create({
      data: {
        id_guru,
        id_kelas,
        tanggal: tanggalObj,
        jam_mulai: jamMulaiObj,
        jam_selesai: jamSelesaiObj,
      },
      include: {
        guru: { select: { namaGuru: true } },
        kelas: { select: { nama_kelas: true } },
      },
    });

    res.status(201).json({
      message: "Jadwal berhasil ditambahkan",
      jadwal: {
        id: jadwal.id,
        id_guru: jadwal.id_guru,
        id_kelas: jadwal.id_kelas,
        tanggal: formatTanggalOnly(jadwal.tanggal),
        jam_mulai: formatJamOnly(jadwal.jam_mulai),
        jam_selesai: formatJamOnly(jadwal.jam_selesai),
        guru: jadwal.guru,
        kelas: jadwal.kelas,
      },
    });
  } catch (err) {
    console.error("[CREATE JADWAL ERROR]", err);
    res.status(500).json({ Error: err.message });
  }
};

export const updateJadwal = async (req, res) => {
  const { id } = req.params;
  const { id_guru, id_kelas, tanggal, jam_mulai, jam_selesai } = req.body;

  try {
    const startOfDay = new Date(`${tanggal}T00:00:00`);
    const endOfDay = new Date(`${tanggal}T23:59:59`);

    const existingJadwal = await prisma.jadwal.findFirst({
      where: {
        id_guru: Number(id_guru),
        id_kelas: Number(id_kelas),
        tanggal: { gte: startOfDay, lte: endOfDay },
        NOT: { id: Number(id) },
      },
    });

    if (existingJadwal) {
      return res.status(400).json({ message: "Jadwal dengan guru, kelas, dan tanggal tersebut sudah ada." });
    }

    const tanggalObj = new Date(tanggal);
    const jamMulaiObj = new Date(`${tanggal}T${jam_mulai}:00`);
    const jamSelesaiObj = new Date(`${tanggal}T${jam_selesai}:00`);

    const updated = await prisma.jadwal.update({
      where: { id: Number(id) },
      data: {
        id_guru: Number(id_guru),
        id_kelas: Number(id_kelas),
        tanggal: tanggalObj,
        jam_mulai: jamMulaiObj,
        jam_selesai: jamSelesaiObj,
      },
      include: {
        guru: { select: { namaGuru: true } },
        kelas: { select: { nama_kelas: true } },
      },
    });

    res.json({
      message: "Jadwal berhasil diperbarui",
      jadwal: {
        id: updated.id,
        id_guru: updated.id_guru,
        id_kelas: updated.id_kelas,
        tanggal: formatTanggalOnly(updated.tanggal),
        jam_mulai: formatJamOnly(updated.jam_mulai),
        jam_selesai: formatJamOnly(updated.jam_selesai),
        guru: updated.guru,
        kelas: updated.kelas,
      },
    });
  } catch (err) {
    console.error("[UPDATE JADWAL ERROR]", err);
    res.status(500).json({ Error: err.message });
  }
};

export const deleteJadwal = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.jadwal.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Jadwal berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};

export const getJadwalGuru = async (req, res) => {
  const guruId = req.user.id;

  try {
    const jadwal = await prisma.jadwal.findMany({
      where: {
        kelas: {
          id_guru: guruId,
        },
      },
      include: {
        kelas: {
          select: { nama_kelas: true },
        },
      },
      orderBy: {
        tanggal: "asc",
      },
    });

    const formatted = jadwal.map((row) => ({
      id: row.id,
      id_kelas: row.id_kelas,
      tanggal: formatTanggalOnly(row.tanggal),
      jam_mulai: formatJamOnly(row.jam_mulai),
      jam_selesai: formatJamOnly(row.jam_selesai),
      kelas: row.kelas,
    }));

    res.json({ jadwal: formatted });
  } catch (err) {
    console.error("Gagal mengambil jadwal guru:", err);
    res.status(500).json({
      message: "Gagal mengambil jadwal",
      error: err.message,
    });
  }
};

export const generateJadwalOtomatis = async (req, res) => {
  try {
    await generateJadwalOtomatisService();
    res.status(200).json({ message: "Generate jadwal berhasil dijalankan (manual)" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal generate jadwal" });
  }
};
