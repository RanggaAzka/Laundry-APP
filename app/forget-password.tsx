import API_URL from "@/constants/api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Email wajib diisi");
      return;
    }

    setIsLoading(true);

    try {
      // Menghubungi API Lupa Password Anda
      const response = await fetch(`${API_URL}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          "Berhasil",
          result.message ||
            "Link atau kode reset password telah dikirim ke email Anda.",
          [{ text: "OK", onPress: () => router.back() }], // Kembali ke halaman login setelah sukses
        );
      } else {
        Alert.alert("Gagal", result.message || "Email tidak terdaftar");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Tidak dapat terhubung ke server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0A192F" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
          {/* HEADER DENGAN TOMBOL KEMBALI */}
          <View
            style={{
              backgroundColor: "#0A192F",
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
              paddingTop: 30,
              paddingBottom: 90,
              paddingHorizontal: 24,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Ornamen Gelembung Desain */}
            <View
              style={{
                position: "absolute",
                top: -20,
                left: -20,
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: "rgba(255,255,255,0.05)",
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: -20,
                right: -40,
                width: 160,
                height: 160,
                borderRadius: 80,
                backgroundColor: "rgba(6,182,212,0.15)",
              }}
            />

            {/* Tombol Back */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
                alignSelf: "flex-start",
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
              <Text
                style={{
                  color: "#ffffff",
                  marginLeft: 8,
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Kembali
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 26,
                fontWeight: "800",
                color: "#ffffff",
                marginBottom: 4,
              }}
            >
              Lupa Password?
            </Text>
            <Text style={{ fontSize: 14, color: "#94a3b8" }}>
              Jangan khawatir, kami akan membantu memulihkan akun Anda
            </Text>
          </View>

          {/* CARD FORM INPUT EMAIL */}
          <View
            style={{
              paddingHorizontal: 24,
              marginTop: -55,
              flex: 1,
              marginBottom: 30,
            }}
          >
            <View
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 24,
                padding: 24,
                shadowColor: "#0f172a",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.06,
                shadowRadius: 15,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#0f172a",
                  marginBottom: 4,
                }}
              >
                Atur Ulang Kata Sandi
              </Text>
              <Text
                style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}
              >
                Masukkan email terdaftar Anda untuk menerima instruksi pemulihan
                password.
              </Text>

              {/* Input Email */}
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    marginBottom: 6,
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#475569",
                  }}
                >
                  Email Terdaftar
                </Text>
                <TextInput
                  placeholder="nama@laundry.com"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  style={{
                    borderWidth: 1.5,
                    borderColor: isEmailFocused ? "#2563eb" : "#e2e8f0",
                    borderRadius: 14,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 15,
                    backgroundColor: isEmailFocused ? "#fff" : "#f8fafc",
                    color: "#0f172a",
                  }}
                />
              </View>

              {/* Tombol Kirim Instruksi */}
              <TouchableOpacity
                onPress={handleResetPassword}
                activeOpacity={0.8}
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? "#93c5fd" : "#2563eb",
                  paddingVertical: 14,
                  borderRadius: 14,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#2563eb",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  elevation: 3,
                  height: 52,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text
                    style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}
                  >
                    Kirim Instruksi Pemulihan
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Hak Cipta */}
            <Text
              style={{
                textAlign: "center",
                color: "#94a3b8",
                fontSize: 11,
                marginTop: 40,
              }}
            >
              &copy; {new Date().getFullYear()} Laundry Mobile Apps. All rights
              reserved.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
