import { DrawerScreenProps } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
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

type Props = DrawerScreenProps<DrawerParamList, "EditAmenity">;

const EditAmenityScreen = ({ route, navigation }: Props) => {
  const { amenity } = route.params;
  const [name, setName] = useState(amenity.name);
  const [description, setDescription] = useState(amenity.description);
  const [is_avaible, setIsAvaible] = useState(amenity.is_avaible);
  const [extra_cost, setExtraCost] = useState(String(amenity.extra_cost));
  // const [photo, setPhoto] = useState<string | null>(amenity.photo || null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(amenity.name);
    setDescription(amenity.description);
    setIsAvaible(amenity.is_avaible);
    setExtraCost(String(amenity.extra_cost));
    // setPhoto(amenity.photo || null);
  }, [amenity]);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`http://localhost:8000/comodidades/${amenity.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        is_avaible,
        extra_cost: Number(extra_cost),
        // photo,
      }),
    });
    navigation.navigate("Amenities");
    setSaving(false);
  };

  return (
    <View style={styles.container}>
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
      <Switch value={is_avaible} onValueChange={setIsAvaible} />
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
  label: {
    fontWeight: "bold",
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

export default EditAmenityScreen;