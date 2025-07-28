  import express from "express";
  import dotenv from "dotenv";
  import cors from "cors";
  import http from "http";
  import { Server } from "socket.io";
  import cookieParser from "cookie-parser";

  import siswaRoute from "./routes/siswa-route.js";
  import guruRoute from "./routes/guru-route.js";
  import kelasRoute from "./routes/kelas-route.js";
  import jadwalRoute from "./routes/jadwal-route.js";
  import tahunajaranRoute from "./routes/tahunAjaran-route.js";
  import semesterRoute from "./routes/semester-route.js";
  import absensiRoute from "./routes/absensi-route.js";
  import authRoute from "./routes/auth-route.js";
  import userRoute from "./routes/user-route.js";
  import notifikasiUserRoutes from "./routes/notifikasi-routes.js"
  import pushRoutes from './routes/push-route.js';
  import "./utils/absensiCron.js";
  import "./utils/jadwalCron.js";
  import "./utils/notifikasiCron.js";
  import './utils/pushNotifCron.js';


  import qrRoute from "./routes/qr-route.js";
  import notifikasiRoutes from "./routes/notifikasi-route.js";

  dotenv.config();

  const app = express();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: ["https://presensisdnuwungjaya.netlify.app", "https://e-presensisdnuwungjaya.com/",],
      credentials: true,
    },
  });

  export { io };

  app.use(cookieParser());
  app.use(express.json());
  app.set("io", io);

  app.use(
    cors({
      origin: ["https://e-presensisdnuwungjaya.com/", "https://presensisdnuwungjaya.netlify.app",],
      credentials: true,
    })
  );

  app.use("/api", authRoute);
  app.use("/api", userRoute);
  app.use("/api", siswaRoute);
  app.use("/api", guruRoute);
  app.use("/api", kelasRoute);
  app.use("/api", jadwalRoute);
  app.use("/api", tahunajaranRoute);
  app.use("/api", semesterRoute);
  app.use("/api", absensiRoute);
  app.use("/api", qrRoute);
  app.use("/api", notifikasiRoutes);
  app.use("/api", notifikasiUserRoutes);
  app.use('/api', pushRoutes);

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });


  const PORT = process.env.PORT || 8800;
  server.listen(PORT, () =>
    console.log(`Server with WebSocket running on port ${PORT}`)
  );
