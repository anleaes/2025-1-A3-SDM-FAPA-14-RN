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

type Props = DrawerScreenProps<DrawerParamList, "Reviews">;

export type Review = {
  id: number;
  rating: number;
  comment: string;
  client?: { id: number; name: string };
  hosting?: { id: number; name: string };
};

const ReviewsScreen = ({ navigation }: Props) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:8000/avaliacoes/");
    const data = await res.json();
    setReviews(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchReviews();
    }, [])
  );

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:8000/avaliacoes/${id}/`, {
      method: "DELETE",
    });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const renderItem = ({ item }: { item: Review }) => (
    <View style={styles.card}>
      <Text style={styles.name}>
        Hospedagem: {item.hosting?.name || "Não informado"}
      </Text>
      <Text style={styles.info}>
        Cliente: {item.client?.name || "Não informado"}
      </Text>
      <Text style={styles.info}>Nota: {item.rating}</Text>
      <Text style={styles.info}>Comentário: {item.comment}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditReview", { review: item })}
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
      <Text style={styles.title}>Avaliações</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateReview")}
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
    marginTop: 4,
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
});

export default ReviewsScreen;
