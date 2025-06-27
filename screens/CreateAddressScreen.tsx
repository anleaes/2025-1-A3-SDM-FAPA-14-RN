import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "CreateAddress">;

const CreateAddressScreen = ({ navigation }: Props) => {
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postal_code, setPostalCode] = useState("");
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setStreet("");
      setNumber("");
      setCity("");
      setState("");
      setPostalCode("");
    }, [])
  );

  const handleSave = async () => {
    setSaving(true);
    await fetch("http://localhost:8000/enderecos/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        street,
        number,
        city,
        state,
        postal_code,
      }),
    });
    navigation.navigate("Address");
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo endereço</Text>
      <Text style={styles.label}>Rua</Text>
      <TextInput value={street} onChangeText={setStreet} style={styles.input} />
      <Text style={styles.label}>Número</Text>
      <TextInput value={number} onChangeText={setNumber} style={styles.input} />
      <Text style={styles.label}>Cidade</Text>
      <TextInput value={city} onChangeText={setCity} style={styles.input} />
      <Text style={styles.label}>Estado</Text>
      <TextInput value={state} onChangeText={setState} style={styles.input} />
      <Text style={styles.label}>CEP</Text>
      <TextInput
        value={postal_code}
        onChangeText={setPostalCode}
        style={styles.input}
      />
      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      )}
      <Button title="Voltar" onPress={() => navigation.navigate("Address")} />
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

export default CreateAddressScreen;