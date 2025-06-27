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
import { Address } from "./AddressScreen";
import { Category } from "./CategoriesScreen";

type Props = DrawerScreenProps<DrawerParamList, "Hostings">;

export type Hosting = {
  id: number;
  name: string;
  description: string;
  daily_price: number;
  is_avaible: boolean;
  category: Category;
  address: Address;
  // doc?: string;
  // photo?: string;
};

const HostingsScreen = ({ navigation }: Props) => {
  const [hostings, setHostings] = useState<Hosting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHostings = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:8000/hospedagens/");
    const data = await response.json();
    setHostings(data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchHostings();
    }, [])
  );

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/hospedagens/${id}/`, {
      method: "DELETE",
    });
    setHostings((prev) => prev.filter((h) => h.id !== id));
  };

  const renderItem = ({ item }: { item: Hosting }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.info}>
        Preço diária: R$ {item.daily_price.toFixed(2)}
      </Text>
      <Text style={styles.info}>
        Disponível: {item.is_avaible ? "Sim" : "Não"}
      </Text>
      <Text style={styles.info}>Categoria: {item.category?.name}</Text>
      <Text style={styles.info}>
        Endereço: {item.address?.street}, {item.address?.number} -{" "}
        {item.address?.city}/{item.address?.state}
      </Text>
      {/* <Text>Documento: {item.doc}</Text> */}
      {/* <Image source={{ uri: item.photo }}/> */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditHosting", { hosting: item })}
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
      <Text style={styles.title}>Hospedagens</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={hostings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateHosting")}
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
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
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

export default HostingsScreen;
