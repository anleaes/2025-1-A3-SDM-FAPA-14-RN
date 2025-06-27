import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "CreateAmenity">;

const CreateAmenityScreen = ({ navigation }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [is_available, setIsAvailable] = useState(false);
  const [extra_cost, setExtraCost] = useState("");
  // const [photo, setPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setName("");
      setDescription("");
      setIsAvailable(false);
      setExtraCost("");
      // setPhoto(null);
    }, [])
  );

  const handleSave = async () => {
    setSaving(true);
    await fetch("http://localhost:8000/comodidades/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        is_available,
        extra_cost: Number(extra_cost),
        // photo,
      }),
    });
    navigation.navigate("Amenities");
    setSaving(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova comodidade</Text>
      <Text style={styles.label}>Nome</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 80 }]}
        multiline
      />
      <Text style={styles.label}>Disponível</Text>
      <Switch value={is_available} onValueChange={setIsAvailable} />
      <Text style={styles.label}>Custo extra</Text>
      <TextInput
        value={extra_cost}
        onChangeText={setExtraCost}
        style={styles.input}
        keyboardType="numeric"
      />
      {/* 
      <Text style={styles.label}>Foto</Text>
      // <TextInput
      //   value={photo || ''}
      //   onChangeText={setPhoto}
      //   style={styles.input}
      // />
      */}
      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      )}
      <Button title="Voltar" onPress={() => navigation.navigate("Amenities")} />
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

export default CreateAmenityScreen;
