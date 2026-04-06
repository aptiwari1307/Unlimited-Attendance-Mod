import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { QRCodeCanvas } from "qrcode.react";

const socket = io("https://unlimited-attendance-mod.onrender.com");
function App() {
  const [qrData, setQrData] = useState("");
  const [rotatingQR, setRotatingQR] = useState("");

  // Receive data from server
  useEffect(() => {
    socket.on("qr-data", (data) => {
      console.log("Received:", data);
      setQrData(data.value);
    });
  }, []);

  // Generate rotating QR every 2 sec
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const newValue = "QR_" + Date.now();
  //     setRotatingQR(newValue);
  //   }, 2000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Live QR System</h1>

      {/* RECEIVED QR */}
      <h2>Received QR</h2>
      <h3>{qrData}</h3>
      {qrData && <QRCodeCanvas value={qrData} size={200} />}
    </div>
  );
}

export default App;