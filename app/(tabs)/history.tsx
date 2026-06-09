import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import API_URL from "@/constants/api";

interface Transaction {
  id: number;
  invoice_code: string;
  total_price: number;
  payment_method: string;
  status: string;
  created_at: string;
}

export default function HistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchHistory = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get(`${API_URL}/api/history-transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setTransactions(response.data.data);
    } catch (error) {
      console.log("ERROR HISTORY :", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHistory();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <ActivityIndicator size="small" color="#4f46e5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4f46e5"]}
            tintColor="#4f46e5"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 }}
        >
          {/* HEADER */}
          <View style={{ marginBottom: 28 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: "#0f172a",
                letterSpacing: -0.5,
              }}
            >
              Riwayat Transaksi
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#64748b",
                marginTop: 4,
              }}
            >
              Daftar cucian yang telah selesai diproses.
            </Text>
          </View>

          {/* SUMMARY MINI CARD - Clean Look */}
          <View
            style={{
              backgroundColor: "#f8fafc",
              borderRadius: 16,
              padding: 16,
              marginBottom: 28,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#f1f5f9",
            }}
          >
            <Text style={{ color: "#334155", fontSize: 14, fontWeight: "500" }}>
              Total Cucian Selesai
            </Text>
            <View
              style={{
                backgroundColor: "#4f46e5",
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 20,
              }}
            >
              <Text
                style={{ color: "#ffffff", fontSize: 14, fontWeight: "700" }}
              >
                {transactions.length} Order
              </Text>
            </View>
          </View>

          {/* EMPTY STATE */}
          {transactions.length === 0 && (
            <View
              style={{
                paddingVertical: 60,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "#94a3b8",
                  fontSize: 14,
                  fontWeight: "400",
                }}
              >
                Belum ada riwayat transaksi.
              </Text>
            </View>
          )}

          {/* LIST HISTORY ITEMS */}
          {transactions.map((item) => (
            <View
              key={item.id}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: "#f1f5f9",
                shadowColor: "#0f172a",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.02,
                shadowRadius: 10,
                elevation: 2,
              }}
            >
              {/* Top Row: Invoice & Status */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: "#f8fafc",
                  paddingBottom: 12,
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    color: "#0f172a",
                    fontSize: 14,
                  }}
                >
                  {item.invoice_code}
                </Text>

                <View
                  style={{
                    backgroundColor: "#e6f4ea",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 20,
                  }}
                >
                  <Text
                    style={{
                      color: "#137333",
                      fontWeight: "600",
                      fontSize: 11,
                      letterSpacing: 0.3,
                    }}
                  >
                    Selesai
                  </Text>
                </View>
              </View>

              {/* Middle Row: Detail Informasi */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ gap: 4 }}>
                  <Text style={{ color: "#64748b", fontSize: 13 }}>
                    {item.payment_method}
                  </Text>
                  <Text
                    style={{
                      color: "#94a3b8",
                      fontSize: 11,
                    }}
                  >
                    Status: {item.status}
                  </Text>
                </View>

                {/* Harga dengan penataan clean */}
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      color: "#0f172a",
                      fontSize: 16,
                      fontWeight: "700",
                    }}
                  >
                    Rp {Number(item.total_price).toLocaleString("id-ID")}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
