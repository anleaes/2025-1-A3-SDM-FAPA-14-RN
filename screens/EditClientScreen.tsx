import { DrawerScreenProps } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "EditClient">;

const EditClientScreen = ({ route, navigation }: Props) => {
  const { client } = route.params;
  const [name, setName] = useState(client.name);
  const [email, setEmail] = useState(client.email);
  const [cell_phone, setCellPhone] = useState(client.cell_phone); 
  const [gender, setGender] = useState<"M" | "F" | "O">(client.gender);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(client.name);
    setEmail(client.email);
    setCellPhone(client.cell_phone); // <-- ajuste aqui
    setGender(client.gender);
  }, [client]);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`http://localhost:8000/clientes/${client.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token b23dc8f982be9e338ce972afe6065768a61f6a2e",
      },
      body: JSON.stringify({
        name,
        email,
        cell_phone,
        gender,
      }),
    });
    navigation.navigate("Clients");
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar cliente</Text>
      <Text style={styles.label}>Nome</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />
      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <Text style={styles.label}>Telefone</Text>
      <TextInput
        value={cell_phone}
        onChangeText={setCellPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>Gênero</Text>
      <View style={styles.genderRow}>
        <Button
          title="Masculino"
          color={gender === "M" ? "#4B7BE5" : "#ccc"}
          onPress={() => setGender("M")}
        />
        <Button
          title="Feminino"
          color={gender === "F" ? "#4B7BE5" : "#ccc"}
          onPress={() => setGender("F")}
        />
        <Button
          title="Outro"
          color={gender === "O" ? "#4B7BE5" : "#ccc"}
          onPress={() => setGender("O")}
        />
      </View>
      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      )}
      <Button title="Voltar" onPress={() => navigation.navigate("Clients")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  genderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
});

export default EditClientScreen;
