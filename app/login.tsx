import API_URL from "@/constants/api";
import { Ionicons } from "@expo/vector-icons"; // Library ikon bawaan Expo
import AsyncStorage from "@react-native-async-storage/async-storage";
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password wajib diisi");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("token", result.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(result.data.user));

        Alert.alert("Berhasil", result.message);
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Login Gagal",
          result.message || "Email atau password salah",
        );
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
          {/* HEADER BACKGROUND DENGAN TEKS SAMBUTAN */}
          <View
            style={{
              backgroundColor: "#0A192F",
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
              paddingTop: 50,
              paddingBottom: 90,
              paddingHorizontal: 24,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Ornamen Gelembung Kiri */}
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
            {/* Ornamen Gelembung Kanan */}
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

            <Text
              style={{
                fontSize: 26,
                fontWeight: "800",
                color: "#ffffff",
                marginBottom: 4,
              }}
            >
              Selamat Datang!
            </Text>
            <Text style={{ fontSize: 14, color: "#94a3b8" }}>
              Silahkan masuk ke akun laundry Anda
            </Text>
          </View>

          {/* CARD FORM LOGIN MELAYANG */}
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
                Masuk ke Akun
              </Text>
              <Text
                style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24 }}
              >
                Gunakan email terdaftar untuk mengelola pesanan.
              </Text>

              {/* Input Email */}
              <View style={{ marginBottom: 18 }}>
                <Text
                  style={{
                    marginBottom: 6,
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#475569",
                  }}
                >
                  Email
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

              {/* Input Password */}
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    marginBottom: 6,
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#475569",
                  }}
                >
                  Password
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={secureText}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    style={{
                      flex: 1,
                      borderWidth: 1.5,
                      borderColor: isPasswordFocused ? "#2563eb" : "#e2e8f0",
                      borderRadius: 14,
                      paddingLeft: 16,
                      paddingRight: 50,
                      paddingVertical: 12,
                      fontSize: 15,
                      backgroundColor: isPasswordFocused ? "#fff" : "#f8fafc",
                      color: "#0f172a",
                    }}
                  />
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      right: 16,
                      height: "100%",
                      justifyContent: "center",
                    }}
                    onPress={() => setSecureText(!secureText)}
                  >
                    <Ionicons
                      name={secureText ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color="#94a3b8"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* TOMBOL LUPA PASSWORD */}
              <TouchableOpacity
                onPress={() => router.push("/forget-password")}
                style={{
                  alignSelf: "flex-end",
                  marginBottom: 24,
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={{
                    color: "#2563eb",
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  Lupa Password?
                </Text>
              </TouchableOpacity>

              {/* Tombol Login */}
              <TouchableOpacity
                onPress={handleLogin}
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
                    Masuk Sekarang
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
