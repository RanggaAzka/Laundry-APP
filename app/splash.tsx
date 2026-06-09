import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SplashScreen() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/login");
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#0A192F", // Warna Biru Premium (Midnight Navy) matching dengan Web & Login
      }}
    >
      {/* StatusBar disesuaikan dengan warna Midnight Navy */}
      <StatusBar barStyle="light-content" backgroundColor="#0A192F" />

      {/* Main Content */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 32,
        }}
      >
        {/* Logo Container - Bentuk Squircle Premium dengan Border Tipis */}
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 28,
            backgroundColor: "rgba(255, 255, 255, 0.03)", // Sedikit disesuaikan agar menyatu dengan warna biru
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.08)",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <MaterialCommunityIcons
            name="washing-machine"
            size={44}
            color="#FFFFFF"
          />
        </View>

        {/* Brand Name - Huruf Kapital, Tipis, & Jarak Lebar */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: "300",
            color: "#FFFFFF",
            letterSpacing: 8,
            textAlign: "center",
          }}
        >
          L A U N D R Y
        </Text>

        {/* Tagline Minimalis */}
        <Text
          style={{
            marginTop: 12,
            fontSize: 13,
            fontWeight: "400",
            color: "rgba(255, 255, 255, 0.4)",
            letterSpacing: 1.5,
            textAlign: "center",
          }}
        >
          Premium Care & Dry Cleaning
        </Text>
      </View>

      {/* Footer & Loader Area */}
      <View
        style={{
          paddingBottom: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Loader dibuat mini dan transparan agar subtle */}
        <ActivityIndicator
          size="small"
          color="#FFFFFF"
          style={{ marginBottom: 24, opacity: 0.5 }}
        />

        <Text
          style={{
            color: "rgba(255, 255, 255, 0.2)", // Sedikit diturunkan opasitasnya agar makin clean
            fontSize: 10,
            letterSpacing: 3,
            fontWeight: "600",
          }}
        >
          EXCLUSIVELY FOR YOU
        </Text>
      </View>
    </SafeAreaView>
  );
}
