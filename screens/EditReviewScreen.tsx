import { Picker } from "@react-native-picker/picker";
import { DrawerScreenProps } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { DrawerParamList } from "../navigation/DrawerNavigator";
import { Client } from "./ClientsScreen";
import { Hosting } from "./HostingsScreen";

type Props = DrawerScreenProps<DrawerParamList, "EditReview">;

const EditReviewScreen = ({ route, navigation }: Props) => {
  const { review } = route.params;
  const [rating, setRating] = useState(String(review.rating));
  const [comment, setComment] = useState(review.comment);
  const [clientId, setClientId] = useState<number | undefined>(
    review.client?.id
  );
  const [hostingId, setHostingId] = useState<number | undefined>(
    review.hosting?.id
  );
  const [clients, setClients] = useState<Client[]>([]);
  const [hostings, setHostings] = useState<Hosting[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRating(String(review.rating));
    setComment(review.comment);
    setClientId(review.client?.id);
    setHostingId(review.hosting?.id);
  }, [review]);

  useEffect(() => {
    const fetchData = async () => {
      const token = "b23dc8f982be9e338ce972afe6065768a61f6a2e";
      const cliRes = await fetch("http://localhost:8000/clientes/", {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      const cliData = await cliRes.json();
      setClients(Array.isArray(cliData) ? cliData : []);

      const hosRes = await fetch("http://localhost:8000/hospedagens/");
      const hosData = await hosRes.json();
      setHostings(Array.isArray(hosData) ? hosData : []);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!clientId || !hostingId) return;
    setSaving(true);
    await fetch(`http://localhost:8000/avaliacoes/${review.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating: Number(rating),
        comment,
        client: clientId,
        hosting: hostingId,
      }),
    });
    navigation.navigate("Reviews");
    setSaving(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar avaliação</Text>
      <Text style={styles.label}>Nota</Text>
      <TextInput
        value={rating}
        onChangeText={setRating}
        style={styles.input}
        keyboardType="numeric"
        placeholder="De 1 a 5"
      />
      <Text style={styles.label}>Comentário</Text>
      <TextInput
        value={comment}
        onChangeText={setComment}
        style={[styles.input, { height: 80 }]}
        multiline
      />
      <Text style={styles.label}>Cliente</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={clientId} onValueChange={setClientId}>
          <Picker.Item label="Selecione..." value={undefined} />
          {clients.map((cli) => (
            <Picker.Item key={cli.id} label={cli.name} value={cli.id} />
          ))}
        </Picker>
      </View>
      <Text style={styles.label}>Hospedagem</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={hostingId} onValueChange={setHostingId}>
          <Picker.Item label="Selecione..." value={undefined} />
          {hostings.map((hos) => (
            <Picker.Item key={hos.id} label={hos.name} value={hos.id} />
          ))}
        </Picker>
      </View>
      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      )}
      <Button title="Voltar" onPress={() => navigation.navigate("Reviews")} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    alignSelf: "center",
  },
  label: {
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
    overflow: "hidden",
  },
});

export default EditReviewScreen;
