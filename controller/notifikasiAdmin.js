import prisma from "../config/prisma.js"

export const getNotifikasiAdmin = async (req, res) => {
  try {
    const data = await prisma.notifikasi_admin.findMany({
      orderBy: { tanggal: "desc" },
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil notifikasi", error });
  }
};

export const markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await prisma.notifikasi_admin.update({
      where: { id: Number(id) },
      data: { dibaca: true },
    });
    res.json(updated);
  } catch (error) {
    console.error("Gagal menandai notifikasi:", error);
    res.status(500).json({ message: "Gagal menandai notifikasi", error });
  }
};

export const deleteNotifikasi = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.notifikasi_admin.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Notifikasi dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus notifikasi", error });
  }
};




