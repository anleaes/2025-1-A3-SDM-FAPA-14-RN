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
import { Hosting } from "./HostingsScreen";
import { Reservation } from "./ReservationsScreen";

type Props = DrawerScreenProps<DrawerParamList, "ReservationHostings">;

export type ReservationHosting = {
  id: number;
  quantity_days: number;
  unit_price: number;
  reservation: Reservation;
  hosting: Hosting;
};

const ReservationHostingsScreen = ({ navigation }: Props) => {
  const [reservationHostings, setReservationHostings] = useState<
    ReservationHosting[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchReservationHostings = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:8000/itens_reserva/");
    const data = await response.json();
    setReservationHostings(data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchReservationHostings();
    }, [])
  );

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/itens_reserva/${id}/`, {
      method: "DELETE",
    });
    setReservationHostings((prev) => prev.filter((rh) => rh.id !== id));
  };

  const renderItem = ({ item }: { item: ReservationHosting }) => (
    <View style={styles.card}>
      <Text style={styles.name}>Hospedagem: {item.hosting?.name}</Text>
      <Text style={styles.info}>
        Reserva: #{item.reservation?.id} - Cliente:{" "}
        {item.reservation?.client?.name}
      </Text>
      <Text style={styles.info}>Dias: {item.quantity_days}</Text>
      <Text style={styles.info}>
        Valor unitário: R$ {item.unit_price.toFixed(2)}
      </Text>
      <Text style={styles.info}>
        Total: R$ {(item.quantity_days * item.unit_price).toFixed(2)}
      </Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("EditReservationHosting", {
              reservationHosting: item,
            })
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
      <Text style={styles.title}>Reservas de Hospedagem</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={reservationHostings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateReservationHosting")}
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
    padding: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});

export default ReservationHostingsScreen;
