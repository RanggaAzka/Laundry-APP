import API_URL from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ExploreProfileScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const handleLogout = async () => {
    Alert.alert("Logout", "Apakah Anda yakin ingin keluar dari akun?", [
      {
        text: "Batal",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // Optional: hit API logout Laravel
            await axios.post(
              `${API_URL}/api/logout`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              },
            );
          } catch (error) {
            console.log("Logout API gagal:", error);
          }

          await AsyncStorage.removeItem("token");

          router.replace("/login");
        },
      },
    ]);
  };

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        if (savedToken) {
          setToken(savedToken);
          await fetchProfileData(savedToken);
        } else {
          Alert.alert(
            "Sesi Berakhir",
            "Token tidak ditemukan, silakan login kembali.",
          );
        }
      } catch (error) {
        console.error("Gagal memuat token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeProfile();
  }, []);

  const fetchProfileData = async (activeToken: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${activeToken}`,
          Accept: "application/json",
        },
      });

      const userData = response.data?.data;
      if (userData) {
        setName(userData.name || "");
        setEmail(userData.email || "");
        setPhone(userData.customer?.phone || "");
        setAddress(userData.customer?.address || "");
      } else {
        Alert.alert("Gagal", "Struktur data profil tidak ditemukan.");
      }
    } catch (error: any) {
      console.error(
        "Error Fetch Profil:",
        error.response?.data || error.message,
      );
      Alert.alert("Error", "Gagal mengambil data profil dari server.");
    }
  };

  const handleUpdateProfile = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert("Peringatan", "Semua kolom wajib diisi!");
      return;
    }

    setIsSaving(true);

    try {
      // Update profil
      await axios.put(
        `${API_URL}/api/profile/update`,
        {
          name,
          phone,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      // Jika user mengisi password
      if (
        currentPassword.trim() &&
        newPassword.trim() &&
        confirmPassword.trim()
      ) {
        await axios.put(
          `${API_URL}/api/change-password`,
          {
            current_password: currentPassword,
            password: newPassword,
            password_confirmation: confirmPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

      Alert.alert("Berhasil 🎉", "Profil berhasil diperbarui");
    } catch (error: any) {
      console.log("STATUS :", error.response?.status);
      console.log("DATA :", JSON.stringify(error.response?.data, null, 2));

      Alert.alert(
        "Gagal",
        error.response?.data?.message || "Terjadi kesalahan",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (
      !currentPassword.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert("Peringatan", "Semua field password wajib diisi!");

      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Peringatan", "Konfirmasi password tidak sama!");

      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Peringatan", "Password minimal 6 karakter!");

      return;
    }

    setIsSaving(true);

    try {
      await axios.put(
        `${API_URL}/api/change-password`,
        {
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      Alert.alert("Berhasil 🎉", "Password berhasil diubah!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.log(error.response?.data || error.message);

      Alert.alert(
        "Gagal",
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengubah password.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const renderInputField = ({
    id,
    label,
    value,
    onChangeText,
    placeholder,
    editable = true,
    keyboardType = "default",
    multiline = false,
    numberOfLines = 1,
    caption = "",
  }: {
    id: string;
    label: string;
    value: string;
    onChangeText?: (text: string) => void;
    placeholder: string;
    editable?: boolean;
    keyboardType?: "default" | "phone-pad";
    multiline?: boolean;
    numberOfLines?: number;
    caption?: string;
  }) => {
    const isFocused = focusedInput === id;

    return (
      <View style={{ marginBottom: 18 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: "#1E293B",
            marginBottom: 6,
          }}
        >
          {label}
        </Text>
        <TextInput
          style={{
            backgroundColor: !editable
              ? "#F1F5F9"
              : isFocused
                ? "#FFFFFF"
                : "#F8FAFC",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 12,
            fontSize: 14,
            color: !editable ? "#64748B" : "#1E293B",
            borderWidth: 1,
            borderColor: isFocused ? "#4F46E5" : "#E2E8F0",
            fontWeight: "500",
            minHeight: multiline ? 80 : undefined,
            textAlignVertical: multiline ? "top" : "center",
          }}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocusedInput(id)}
          onBlur={() => setFocusedInput(null)}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          editable={editable}
          keyboardType={keyboardType as any}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
        {caption ? (
          <Text
            style={{
              fontSize: 11,
              color: "#64748B",
              marginTop: 6,
              lineHeight: 16,
            }}
          >
            {caption}
          </Text>
        ) : null}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F8FAFC",
        }}
      >
        <ActivityIndicator size="small" color="#4F46E5" />
        <Text
          style={{
            marginTop: 12,
            color: "#64748B",
            fontSize: 14,
            fontWeight: "500",
          }}
        >
          Menyelaraskan profil...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F19" />

      {/* Header Premium Deep Slate */}
      <View
        style={{
          backgroundColor: "#0B0F19",
          paddingTop: 50,
          paddingBottom: 70,
          alignItems: "center",
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <View
          style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.15)",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <View
            style={{
              width: 76,
              height: 76,
              borderRadius: 38,
              backgroundColor: "#4F46E5",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 26, fontWeight: "600" }}>
              {name ? name.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            color: "#FFFFFF",
            letterSpacing: 0.2,
          }}
        >
          {name || "Pengguna"}
        </Text>

        {/* Badge Premium Minimalis */}
        <View
          style={{
            backgroundColor: "rgba(99, 102, 241, 0.15)",
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 20,
            marginTop: 8,
            borderWidth: 1,
            borderColor: "rgba(99, 102, 241, 0.25)",
          }}
        ></View>
      </View>

      {/* Floating Form Card dengan Soft Shadow */}
      <ScrollView
        style={{ flex: 1, marginTop: -40 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            padding: 20,
            shadowColor: "#0A0F1D",
            shadowOpacity: 0.04,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 8 },
            elevation: 4,
          }}
        >
          {renderInputField({
            id: "name",
            label: "Nama Lengkap",
            value: name,
            onChangeText: setName,
            placeholder: "Masukkan nama lengkap",
          })}

          {renderInputField({
            id: "email",
            label: "Alamat Email",
            value: email,
            placeholder: "Email tidak terdaftar",
            editable: false,
            caption: "Demi keamanan akun, email tidak dapat diubah.",
          })}

          {renderInputField({
            id: "current_password",
            label: "Password Saat Ini",
            value: currentPassword,
            onChangeText: setCurrentPassword,
            placeholder: "Masukkan password lama",
          })}

          {renderInputField({
            id: "new_password",
            label: "Password Baru",
            value: newPassword,
            onChangeText: setNewPassword,
            placeholder: "Masukkan password baru",
          })}

          {renderInputField({
            id: "confirm_password",
            label: "Konfirmasi Password",
            value: confirmPassword,
            onChangeText: setConfirmPassword,
            placeholder: "Ulangi password baru",
          })}

          {/* {renderInputField({
            id: "phone",
            label: "Nomor WhatsApp",
            value: phone,
            onChangeText: setPhone,
            placeholder: "Contoh: 081234567xx",
            keyboardType: "phone-pad",
          })} */}

          {/* {renderInputField({
            id: "address",
            label: "Alamat Pengiriman Laundry",
            value: address,
            onChangeText: setAddress,
            placeholder: "Tuliskan detail alamat pengiriman...",
            multiline: true,
            numberOfLines: 3,
          })} */}

          {/* Tombol Simpan Clean Solid */}
          <TouchableOpacity
            style={{
              backgroundColor: isSaving ? "#64748B" : "#0B0F19",
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
              opacity: isSaving ? 0.7 : 1,
            }}
            onPress={handleUpdateProfile}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 15,
                  fontWeight: "600",
                  letterSpacing: 0.3,
                }}
              >
                Simpan Perubahan
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#EF4444",
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 12,
            }}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 15,
                fontWeight: "600",
                letterSpacing: 0.3,
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
