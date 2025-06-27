import { Ionicons } from "@expo/vector-icons";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DrawerParamList } from "../navigation/DrawerNavigator";
import { Client } from "./ClientsScreen";

type Props = DrawerScreenProps<DrawerParamList, "Reservations">;

export type Reservation = {
  id: number;
  checkin_date: string;
  checkout_date: string;
  total_price: number;
  status: "CONFIRMED" | "PENDING" | "CANCELED";
  payment_method: "CREDIT_CARD" | "DEBIT_CARD" | "PIX" | "PAYMENT_SLIP";
  client?: Client | null;
  // doc?: string;
};

const ReservationsScreen = ({ navigation }: Props) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:8000/reservas/");
    const data = await res.json();
    setReservations(data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchReservations();
    }, [])
  );

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/reservas/${id}/`, {
      method: "DELETE",
    });
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  const renderItem = ({ item }: { item: Reservation }) => (
    <View style={styles.card}>
      <Text style={styles.name}>Cliente: {item.client?.name}</Text>
      <Text style={styles.info}>
        Check-in: {item.checkin_date} | Check-out: {item.checkout_date}
      </Text>
      <Text style={styles.info}>
        Valor total: R$ {Number(item.total_price).toFixed(2)}
      </Text>
      <Text style={styles.info}>
        Status:{" "}
        {item.status === "CONFIRMED"
          ? "Confirmado"
          : item.status === "PENDING"
          ? "Pendente"
          : "Cancelado"}
      </Text>
      <Text style={styles.info}>
        Pagamento:{" "}
        {item.payment_method === "CREDIT_CARD"
          ? "Cartão de Crédito"
          : item.payment_method === "DEBIT_CARD"
          ? "Cartão de Débito"
          : item.payment_method === "PIX"
          ? "PIX"
          : "Boleto"}
      </Text>
      {/* <Text>Documento: {item.doc}</Text> */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("EditReservation", { reservation: item })
          }
        >
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.editText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reservas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateReservation")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
    alignSelf: "center",
  },
  card: {
    backgroundColor: "#f0f4ff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  info: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  row: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "flex-end",
  },
  editButton: {
    backgroundColor: "#4B7BE5",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#E54848",
    padding: 8,
    borderRadius: 6,
  },
  editText: {
    color: "#fff",
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#0D47A1",
    borderRadius: 28,
    padding: 14,
    elevation: 4,
  },
});

export default ReservationsScreen;
