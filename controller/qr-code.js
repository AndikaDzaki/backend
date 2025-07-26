import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/token.js";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_token";

export const getQrToken = async (req, res) => {
  const { id } = req.params;

  try {
    const idSiswa = parseInt(id);

    if (isNaN(idSiswa)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    let qrCode = await prisma.qr_codes.findUnique({
      where: { id_siswa: idSiswa },
    });

    let isValidToken = false;

    if (qrCode) {
      try {
        const decoded = jwt.verify(qrCode.kode_qr, JWT_SECRET);
        isValidToken = typeof decoded === "object" && decoded.id_siswa === idSiswa;
      } catch (err) {
        isValidToken = false;
      }
    }

    if (!qrCode || !isValidToken) {
      const token = generateToken({ id_siswa: idSiswa });

      if (qrCode) {
        qrCode = await prisma.qr_codes.update({
          where: { id_siswa: idSiswa },
          data: { kode_qr: token },
        });
      } else {
        qrCode = await prisma.qr_codes.create({
          data: {
            id_siswa: idSiswa,
            kode_qr: token,
          },
        });
      }
    }

    res.json({ token: qrCode.kode_qr });
  } catch (error) {
    console.error("Gagal generate QR token:", error);
    res.status(500).json({ message: "Gagal mengambil QR token" });
  }
};
