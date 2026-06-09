import API_URL from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

interface Transaction {
  id: number;
  invoice_code: string;
  total_price: number;
  payment_method: string;
  status: string;

  customer: {
    user: {
      name: string;
    };
  };

  details: {
    id: number;
    weight: number;
    price: number;
    subtotal: number;

    service: {
      service_name: string;
      unit: string;
    };
  }[];
}

export default function DashboardScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [statusLaundry, setStatusLaundry] = useState({
    antrian: 0,
    dicuci: 0,
    disetrika: 0,
    siap_diambil: 0,
    diambil: 0,
  });

  const fetchDashboard = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await axios.get(`${API_URL}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setTransactions(response.data.transactions);
      setStatusLaundry(response.data.statusCounts);
    } catch (error) {
      console.log("ERROR DASHBOARD :", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  const statusOrder = [
    "antrian",
    "dicuci",
    "disetrika",
    "siap diambil",
    "diambil",
  ];

  const getStatusIndex = (status: string) => {
    const formattedStatus = status.toLowerCase().replace("_", " ");

    const index = statusOrder.indexOf(formattedStatus);

    return index !== -1 ? index : 0;
  };

  const RenderStatusStepper = ({
    currentStatus,
  }: {
    currentStatus: string;
  }) => {
    const activeIndex = getStatusIndex(currentStatus);

    const steps = [
      { id: 1, label: "Antrian" },
      { id: 2, label: "Cuci" },
      { id: 3, label: "Setrika" },
      { id: 4, label: "Siap" },
      { id: 5, label: "Selesai" },
    ];

    const progressWidth = `${(activeIndex / (steps.length - 1)) * 100}%`;

    return (
      <View
        style={{
          marginVertical: 12,
          paddingHorizontal: 6,
          position: "relative",
        }}
      >
        {/* Background Track */}
        <View
          style={{
            position: "absolute",
            top: 11,
            left: 12,
            right: 12,
            height: 6,
            backgroundColor: "#f1f5f9",
            borderRadius: 10,
            zIndex: 0,
          }}
        />

        {/* Active Track */}
        <View
          style={{
            position: "absolute",
            top: 11,
            left: 12,
            width: progressWidth as any,
            height: 6,
            backgroundColor: "#4f46e5",
            borderRadius: 10,
            zIndex: 1,
          }}
        />

        {/* Step Nodes */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            zIndex: 2,
          }}
        >
          {steps.map((step, index) => {
            const isPassed = index < activeIndex;
            const isCurrent = index === activeIndex;

            return (
              <View key={step.id} style={{ alignItems: "center", flex: 1 }}>
                <View
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: isCurrent
                      ? "#ffffff"
                      : isPassed
                        ? "#4f46e5"
                        : "#ffffff",

                    justifyContent: "center",
                    alignItems: "center",

                    borderWidth: isCurrent ? 6 : 2,

                    borderColor: isCurrent
                      ? "#4f46e5"
                      : isPassed
                        ? "#4f46e5"
                        : "#e2e8f0",

                    shadowColor: "#4f46e5",
                    shadowOpacity: isCurrent ? 0.4 : 0,
                    shadowRadius: 8,
                    elevation: isCurrent ? 4 : 0,
                  }}
                >
                  {isPassed && !isCurrent && (
                    <Text
                      style={{
                        color: "#ffffff",
                        fontSize: 10,
                        fontWeight: "900",
                      }}
                    >
                      ✓
                    </Text>
                  )}
                </View>

                <Text
                  numberOfLines={1}
                  style={{
                    marginTop: 6,
                    fontSize: 10,
                    fontWeight: isCurrent ? "700" : "500",
                    color: isCurrent ? "#1e1b4b" : "#94a3b8",
                  }}
                >
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fafafa",
        }}
      >
        <ActivityIndicator size="large" color="#4f46e5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fafafa" />

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
            paddingHorizontal: 22,
            paddingTop: 26,
            paddingBottom: 32,
          }}
        >
          {/* Header */}
          <View
            style={{
              marginBottom: 28,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#10b981",
                  }}
                />

                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "700",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                  }}
                >
                  Monitoring Hub
                </Text>
              </View>

              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "900",
                  color: "#1e1b4b",
                  marginTop: 4,
                  letterSpacing: -0.5,
                }}
              >
                Cucian Anda
              </Text>
            </View>

            <View
              style={{
                backgroundColor: "#e0e7ff",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 30,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: "#4f46e5",
                }}
              >
                Live Update
              </Text>
            </View>
          </View>

          {/* Status Cards */}
          <View
            style={{
              flexDirection: "row",
              gap: 14,
              marginBottom: 32,
              height: 110,
            }}
          >
            {/* Sedang Diproses */}
            <View
              style={{
                flex: 1.3,
                backgroundColor: "#1e1b4b",
                borderRadius: 24,
                padding: 16,
                justifyContent: "space-between",
                shadowColor: "#1e1b4b",
                shadowOpacity: 0.2,
                shadowRadius: 10,
                elevation: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: "#c7d2fe",
                  textTransform: "uppercase",
                }}
              >
                Sedang Diolah
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "baseline",
                  gap: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 36,
                    fontWeight: "800",
                    color: "#ffffff",
                  }}
                >
                  {statusLaundry.dicuci + statusLaundry.disetrika}
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    color: "#93c5fd",
                    fontWeight: "500",
                  }}
                >
                  Pesanan
                </Text>
              </View>
            </View>

            {/* Right Boxes */}
            <View style={{ flex: 1, gap: 10 }}>
              {/* Antrian */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#ffffff",
                  borderRadius: 16,
                  paddingHorizontal: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderWidth: 1,
                  borderColor: "#f1f5f9",
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: "#64748b",
                  }}
                >
                  Antrian
                </Text>

                <View
                  style={{
                    backgroundColor: "#fef3c7",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "800",
                      color: "#d97706",
                    }}
                  >
                    {statusLaundry.antrian}
                  </Text>
                </View>
              </View>

              {/* Siap Ambil */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#ffffff",
                  borderRadius: 16,
                  paddingHorizontal: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderWidth: 1,
                  borderColor: "#f1f5f9",
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: "#64748b",
                  }}
                >
                  Siap Ambil
                </Text>

                <View
                  style={{
                    backgroundColor: "#dcfce7",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "800",
                      color: "#16a34a",
                    }}
                  >
                    {statusLaundry.siap_diambil}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Title */}
          <View
            style={{
              marginBottom: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                color: "#1e1b4b",
              }}
            >
              Progres Pencucian
            </Text>

            <Text
              style={{
                fontSize: 12,
                fontWeight: "500",
                color: "#94a3b8",
              }}
            >
              Total: {transactions.length}
            </Text>
          </View>

          {/* Empty State */}
          {transactions.length === 0 && (
            <View
              style={{
                paddingVertical: 50,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#94a3b8",
                  fontSize: 14,
                  fontWeight: "500",
                }}
              >
                Tidak ada progres pencucian terbaru.
              </Text>
            </View>
          )}

          {/* Transaction Cards */}
          {transactions.map((item) => (
            <View
              key={item.id}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 28,
                padding: 18,
                marginBottom: 20,
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.03,
                shadowRadius: 16,
                elevation: 4,
                borderWidth: 1,
                borderColor: "#f8fafc",
              }}
            >
              {/* Top Meta */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#f1f5f9",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: "#475569",
                    }}
                  >
                    {item.invoice_code}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: "#e0f2fe",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: "#0369a1",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.payment_method}
                  </Text>
                </View>
              </View>

              {/* Customer */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 11,
                    color: "#94a3b8",
                    fontWeight: "600",
                  }}
                >
                  Nama Pelanggan
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "800",
                    color: "#1e1b4b",
                    marginTop: 4,
                  }}
                >
                  {item.customer.user.name}
                </Text>
              </View>

              {/* Services */}
              <View style={{ gap: 10, marginBottom: 16 }}>
                {item.details.map((detail) => (
                  <View
                    key={detail.id}
                    style={{
                      backgroundColor: "#f8fafc",
                      borderRadius: 18,
                      padding: 14,
                      borderWidth: 1,
                      borderColor: "#f1f5f9",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View style={{ flex: 1 }}>
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
                            fontSize: 12,
                            color: "#64748b",
                            marginTop: 4,
                          }}
                        >
                          {detail.weight} {detail.service.unit} × Rp{" "}
                          {Number(detail.price).toLocaleString("id-ID")}
                        </Text>
                      </View>

                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "900",
                          color: "#4f46e5",
                        }}
                      >
                        Rp {Number(detail.subtotal).toLocaleString("id-ID")}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Total */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: "#ecfdf5",
                  padding: 14,
                  borderRadius: 18,
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    color: "#065f46",
                    fontWeight: "700",
                  }}
                >
                  Total Tagihan
                </Text>

                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "900",
                    color: "#10b981",
                  }}
                >
                  Rp {Number(item.total_price).toLocaleString("id-ID")}
                </Text>
              </View>

              {/* Stepper */}
              <RenderStatusStepper currentStatus={item.status} />
              <TouchableOpacity
                onPress={() => router.push(`/transaction/${item.id}` as any)}
                activeOpacity={0.8}
                style={{
                  marginTop: 10,
                  backgroundColor: "#4f46e5",
                  paddingVertical: 14,
                  borderRadius: 18,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#4f46e5",
                  shadowOpacity: 0.25,
                  shadowRadius: 10,
                  elevation: 4,
                }}
              >
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: 14,
                    fontWeight: "800",
                    letterSpacing: 0.3,
                  }}
                >
                  Lihat Kondisi Baju
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
