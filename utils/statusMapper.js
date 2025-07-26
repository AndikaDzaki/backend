export function mapStatusToEnum(status) {
  if (status === "Aktif") return "Aktif";
  if (status === "Tidak Aktif") return "Tidak_Aktif";
  throw new Error("Status tidak valid: " + status);
}
