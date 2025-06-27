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

type Props = DrawerScreenProps<DrawerParamList, "Clients">;

export type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: "M" | "F" | "O";
  // doc?: string;
  // photo?: string;
};

const ClientsScreen = ({ navigation }: Props) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:8000/clientes/", {
      headers: {
        Authorization: "Token b23dc8f982be9e338ce972afe6065768a61f6a2e",
      },
    });
    const data = await response.json();
    setClients(data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchClients();
    }, [])
  );

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/clientes/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: "Token b23dc8f982be9e338ce972afe6065768a61f6a2e",
      },
    });
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const renderItem = ({ item }: { item: Client }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.email}>Email: {item.email}</Text>
      <Text style={styles.phone}>Telefone: {item.phone}</Text>
      <Text style={styles.phone}>
        Gênero:{" "}
        {item.gender === "M"
          ? "Masculino"
          : item.gender === "F"
          ? "Feminino"
          : "Outro"}
      </Text>
      {/* <Text>Documento: {item.doc}</Text> */}
      {/* <Image source={{ uri: item.photo }}/> */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditClient", { client: item })}
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
      <Text style={styles.title}>Clientes</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={clients}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateClient")}
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
  email: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  phone: {
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

export default ClientsScreen;
