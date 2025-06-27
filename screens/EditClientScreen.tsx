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
  const [phone, setPhone] = useState(client.phone);
  // const [doc, setDoc] = useState(client.doc || '');
  // const [photo, setPhoto] = useState(client.photo || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(client.name);
    setEmail(client.email);
    setPhone(client.phone);
    // setDoc(client.doc || '');
    // setPhoto(client.photo || '');
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
        phone,
        // doc,
        // photo,
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
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />
      {/* 
      <Text style={styles.label}>Documento</Text>
      <TextInput
        value={doc}
        onChangeText={setDoc}
        style={styles.input}
      />
      <Text style={styles.label}>Foto</Text>
      <TextInput
        value={photo}
        onChangeText={setPhoto}
        style={styles.input}
      />
      */}
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
});

export default EditClientScreen;
