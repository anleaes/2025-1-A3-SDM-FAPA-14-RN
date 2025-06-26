import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DrawerParamList } from "../navigation/DrawerNavigator";
import { Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";

type Props = DrawerScreenProps<DrawerParamList, "Amenities">;

export type Amenity = {
  id: number;
  name: string;
  description: string;
  is_avaible: boolean;
  extra_cost: number;
  // photo?: string;
};

const AmenitiesScreen = ({ navigation }: Props) => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAmenities = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:8000/comodidades/");
    const data = await response.json();
    setAmenities(data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchAmenities();
    }, [])
  );

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/comodidades/${id}`, {
      method: "DELETE",
    });
    setAmenities((prev) => prev.filter((a) => a.id !== id));
  };

  const renderItem = ({ item }: { item: Amenity }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text>Disponível: {item.is_avaible ? "Sim" : "Não"}</Text>
      <Text>Custo extra: {item.extra_cost}</Text>
      {/* {item.photo && <Image source={{ uri: item.photo }} style={{ width: 50, height: 50 }} />} */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("EditAmenity", { amenity: item })}
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
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comodidades</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={amenities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity
      style={styles.fab}
      onPress={() => navigation.navigate('CreateAmenity')}
    >
      <Ionicons name="add" size={28} color="#fff"  />
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
  editButton: {
    backgroundColor: "#4B7BE5",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
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
  deleteButton: {
    backgroundColor: "#E54848",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  row: {
    flexDirection: "row",
    marginTop: 8,
    alignSelf: "flex-end",
  },
});

export default AmenitiesScreen;