import { z } from "zod";

export const KehadiranSiswa = z.enum(["Hadir", "Izin", "Sakit", "Alpa", "Belum", "Libur"]);

export const absensiSchema = z.object({
  id: z.number().optional(),
  id_siswa: z.number().min(1, "Pilih siswa"),
  kelas_id: z.number().min(1, "Pilih kelas"),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal harus dalam format YYYY-MM-DD"),
  status: KehadiranSiswa,
});
