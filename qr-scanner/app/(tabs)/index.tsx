import { useEffect, useRef,useState } from "react";
import { Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { io } from "socket.io-client";
import Slider from "@react-native-community/slider";


const socket = io("https://unlimited-attendance-mod.onrender.com", {
  transports: ["websocket"],
});
export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [zoom, setZoom] = useState(0);
  const lastScanned = useRef("");
  const lastTime = useRef(0);

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission) return <Text>Requesting permission</Text>;
  if (!permission.granted) return <Text>No camera access</Text>;

  return (
  <View style={{ flex: 1 }}>
    <CameraView
      style={{ flex: 1 }}
      zoom={zoom}
      barcodeScannerSettings={{
        barcodeTypes: ["qr"],
      }}
      onBarcodeScanned={(event) => {
        const now = Date.now();

        if (
          event.data !== lastScanned.current ||
          now - lastTime.current > 2000
        ) {
          console.log("Scanned:", event.data);
          socket.emit("qr-data", event.data);

          lastScanned.current = event.data;
          lastTime.current = now;
        }
      }}
    />

    {/* ZOOM SLIDER */}
    <Slider
      style={{
        position: "absolute",
        bottom: 50,
        width: "90%",
        alignSelf: "center",
      }}
      minimumValue={0}
      maximumValue={1}
      value={zoom}
      onValueChange={(value) => setZoom(value)}
    />
  </View>
);
}