import  prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

export const getAllGuru = async (req, res) => {
  try {
    const guru = await prisma.guru.findMany();
    return res.status(200).json(guru);
  } catch (err) {
    return res.status(400).json({ Error: err.message });
  }
};

export const addGuru = async (req, res) => {
  const { namaGuru, nik, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newGuru = await prisma.guru.create({
      data: {
        namaGuru,
        nik,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "Guru ditambahkan", id: newGuru.id });
  } catch (err) {
    return res.status(400).json({ Error: err.message });
  }
};

export const deleteGuru = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.guru.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({ message: "Data guru dihapus" });
  } catch (err) {
    return res.status(400).json({ Error: err.message });
  }
};

export const updateGuru = async (req, res) => {
  const { id } = req.params;
  const { namaGuru, nik, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.guru.update({
      where: { id: Number(id) },
      data: {
        namaGuru,
        nik,
        email,
        password: hashedPassword,
      },
    });

    return res.status(200).json({ message: "Data guru diperbarui" });
  } catch (err) {
    return res.status(400).json({ Error: err.message });
  }
};

export const getGuruProfile = async (req, res) => {
  const guruId = req.user?.id;

  if (!guruId) return res.status(401).json({ message: "Unauthorized" });

  const guru = await prisma.guru.findUnique({ where: { id: guruId } });

  res.json(guru);
};
