import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_token";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (email === "admin@example.com") {
      if (password !== "password123") {
        return res.status(401).json({ message: "Email atau password salah." });
      }

      const token = jwt.sign({ role: "admin", name: "Admin Sekolah" }, JWT_SECRET, { expiresIn: "1d" });

      res.cookie("admin_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.json({ success: true, role: "admin", name: "Admin Sekolah" });
    }

    const guru = await prisma.guru.findUnique({
      where: { email },
    });

    if (!guru) {
      return res.status(401).json({ message: "Email tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(password, guru.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign({ role: "user", id: guru.id, name: guru.namaGuru }, JWT_SECRET, { expiresIn: "1d" });

    res.cookie("guru_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, role: "user", name: guru.namaGuru });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login gagal", error: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("admin_token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.clearCookie("guru_token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.json({ success: true, message: "Logout berhasil" });
};


export const getMe = (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Tidak ada user di request" });
  }

  res.json({
    id: user.id || null,
    name: user.name,
    role: user.role,
  });
};
