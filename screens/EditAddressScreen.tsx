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

type Props = DrawerScreenProps<DrawerParamList, "EditAddress">;

const EditAddressScreen = ({ route, navigation }: Props) => {
  const { address } = route.params;
  const [street, setStreet] = useState(address.street);
  const [number, setNumber] = useState(address.number);
  const [city, setCity] = useState(address.city);
  const [state, setState] = useState(address.state);
  const [postal_code, setPostalCode] = useState(address.postal_code);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStreet(address.street);
    setNumber(address.number);
    setCity(address.city);
    setState(address.state);
    setPostalCode(address.postal_code);
  }, [address]);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`http://localhost:8000/enderecos/${address.id}/`, {
      method: "PUT",
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
      <Text style={styles.title}>Editar endereço</Text>
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

export default EditAddressScreen;
