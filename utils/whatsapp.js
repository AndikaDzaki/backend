import fetch from "node-fetch"
import dotenv from "dotenv"

dotenv.config();

export const kirimWhatsapp = async (nomorTujuan, pesan) =>{
    try{
        const res = await fetch("https://api.fonnte.com/send", {
            method: "POST",
            headers: {
                Authorization: process.env.FONNTE_API_TOKEN,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body : new URLSearchParams({
                target: nomorTujuan,
                message: pesan,
                delay: "2"
            })
        })

        const data = await res.json();
        console.log("WhatsApp sent:", data);
        return data;
    } catch (error){
        console.error("Gagal Kirim WA:", error);
        return null;
    }
}