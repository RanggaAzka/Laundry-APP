import API_URL from "@/constants/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

interface TransactionDetail {
  id: number;
  weight: number;
  price: number;
  subtotal: number;
  service: {
    service_name: string;
    unit: string;
  };
}

interface Transaction {
  id: number;
  invoice_code: string;
  total_price: number;
  payment_method: string;
  payment_status: string;
  status: string;
  clothes_photo: string | null;

  customer: {
    user: {
      name: string;
    };
  };

  details: TransactionDetail[];
}

export default function DetailScreen() {
  const { id } = useLocalSearchParams();

  const [transaction, setTransaction] = useState<Transaction | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDetail = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get(`${API_URL}/api/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setTransaction(response.data.transaction);
    } catch (error) {
      console.log("ERROR DETAIL :", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDetail();
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8fafc",
        }}
      >
        <ActivityIndicator size="large" color="#4f46e5" />
      </SafeAreaView>
    );
  }

  if (!transaction) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Data transaksi tidak ditemukan</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4f46e5"]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 40,
          }}
        >
          {/* BUTTON BACK */}
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={{
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "flex-start",
              width: 42,
              height: 42,
              borderRadius: 21, // Lingkaran sempurna
              backgroundColor: "#ffffff",
              marginBottom: 20,

              // Shadow lembut
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#1e293b" />
          </TouchableOpacity>
          {/* HEADER */}
          <View
            style={{
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: 28,
                fontWeight: "900",
                color: "#1e1b4b",
              }}
            >
              Detail Laundry
            </Text>

            <Text
              style={{
                marginTop: 4,
                color: "#64748b",
                fontWeight: "600",
              }}
            >
              {transaction.invoice_code}
            </Text>
          </View>

          {/* FOTO BAJU */}
          <View
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 28,
              padding: 18,
              marginBottom: 22,
              borderWidth: 1,
              borderColor: "#f1f5f9",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "800",
                color: "#1e293b",
                marginBottom: 16,
              }}
            >
              Foto Kondisi Baju
            </Text>

            {transaction.clothes_photo ? (
              <Image
                source={{
                  uri: `${API_URL}/storage/${transaction.clothes_photo}`,
                }}
                style={{
                  width: "100%",
                  height: 250,
                  borderRadius: 20,
                }}
                resizeMode="cover"
              />
            ) : (
              <View
                style={{
                  height: 220,
                  borderRadius: 20,
                  backgroundColor: "#f8fafc",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#94a3b8",
                    fontWeight: "600",
                  }}
                >
                  Tidak ada foto
                </Text>
              </View>
            )}
          </View>

          {/* CUSTOMER */}
          <View
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 28,
              padding: 18,
              marginBottom: 22,
              borderWidth: 1,
              borderColor: "#f1f5f9",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "800",
                color: "#1e293b",
                marginBottom: 16,
              }}
            >
              Informasi Customer
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "#64748b" }}>Nama</Text>

              <Text
                style={{
                  fontWeight: "700",
                  color: "#0f172a",
                }}
              >
                {transaction.customer.user.name}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: "#64748b" }}>Pembayaran</Text>

              <Text
                style={{
                  fontWeight: "700",
                  color: "#4f46e5",
                  textTransform: "capitalize",
                }}
              >
                {transaction.payment_method}
              </Text>
            </View>
          </View>

          {/* DETAIL LAYANAN */}
          <View
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 28,
              padding: 18,
              borderWidth: 1,
              borderColor: "#f1f5f9",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "800",
                color: "#1e293b",
                marginBottom: 16,
              }}
            >
              Detail Layanan
            </Text>

            {transaction.details.map((detail) => (
              <View
                key={detail.id}
                style={{
                  backgroundColor: "#f8fafc",
                  padding: 14,
                  borderRadius: 18,
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "800",
                    color: "#1e1b4b",
                  }}
                >
                  {detail.service.service_name}
                </Text>

                <Text
                  style={{
                    marginTop: 4,
                    color: "#64748b",
                    fontWeight: "500",
                  }}
                >
                  {detail.weight} {detail.service.unit} × Rp{" "}
                  {Number(detail.price).toLocaleString("id-ID")}
                </Text>

                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 16,
                    fontWeight: "900",
                    color: "#10b981",
                  }}
                >
                  Rp {Number(detail.subtotal).toLocaleString("id-ID")}
                </Text>
              </View>
            ))}

            {/* TOTAL */}
            <View
              style={{
                marginTop: 8,
                backgroundColor: "#ecfdf5",
                padding: 18,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  color: "#059669",
                  fontWeight: "700",
                  marginBottom: 4,
                }}
              >
                Total Pembayaran
              </Text>

              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "900",
                  color: "#059669",
                }}
              >
                Rp {Number(transaction.total_price).toLocaleString("id-ID")}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
