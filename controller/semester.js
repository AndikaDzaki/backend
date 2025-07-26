import  prisma  from "../config/prisma.js";
import { mapStatusToEnum } from "../utils/statusMapper.js";


export const getAllSemester = async (req, res) => {
  try {
    const now = new Date();

    const semesters = await prisma.semester.findMany({
      include: {
        tahun_ajaran: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    
    const updates = semesters
      .filter(s => new Date(s.end_date) < now && s.status === "Aktif")
      .map(s =>
        prisma.semester.update({
          where: { id: s.id },
          data: { status: "Tidak_Aktif" },
        })
      );

    await Promise.all(updates);

    const updatedSemesters = semesters.map(s => ({
  ...s,
  status:
    new Date(s.end_date) < now && s.status === "Aktif"
      ? "Tidak Aktif"
      : s.status === "Tidak_Aktif"
        ? "Tidak Aktif"
        : s.status,
    start_date: new Date(s.start_date).toISOString().split("T")[0], 
    end_date: new Date(s.end_date).toISOString().split("T")[0], 
}));


    res.status(200).json(updatedSemesters);
  } catch (err) {
    console.error("Gagal mengambil data semester:", err);
    res.status(500).json({ error: "Gagal mengambil data semester" });
  }
};

export const createSemester = async (req, res) => {
  const { tahun_ajaran_id, semester, startDate, endDate, status } = req.body;

  if (!tahun_ajaran_id || !semester || !startDate || !endDate || !status) {
    return res.status(400).json({ error: "Semua field wajib diisi" });
  }

  try {
    const newSemester = await prisma.semester.create({
      data: {
        tahun_ajaran_id,
        semester,
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        status: mapStatusToEnum(status),
      },
    });

    res.status(201).json({
      message: "Semester berhasil ditambahkan",
      id: newSemester.id,
    });
  } catch (err) {
    console.error("Gagal menambahkan semester:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateSemester = async (req, res) => {
  const { id } = req.params;
  const { tahun_ajaran_id, semester, startDate, endDate, status } = req.body;

  try {
    await prisma.semester.update({
      where: { id: Number(id) },
      data: {
        tahun_ajaran_id,
        semester,
        start_date: new Date(startDate),
        end_date: new Date(endDate),
        status: mapStatusToEnum(status),
      },
    });

    res.json({ message: "Semester berhasil diperbarui" });
  } catch (err) {
    console.error("Gagal update semester:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteSemester = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.semester.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Semester berhasil dihapus" });
  } catch (err) {
    console.error("Gagal hapus semester:", err);
    res.status(500).json({ error: err.message });
  }
};
