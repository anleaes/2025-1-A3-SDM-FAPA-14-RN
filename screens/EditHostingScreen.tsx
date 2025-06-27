import { Picker } from "@react-native-picker/picker";
import { DrawerScreenProps } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { DrawerParamList } from "../navigation/DrawerNavigator";
import { Address } from "./AddressScreen";
import { Category } from "./CategoriesScreen";

type Props = DrawerScreenProps<DrawerParamList, "EditHosting">;

const EditHostingScreen = ({ route, navigation }: Props) => {
  const { hosting } = route.params;
  const [name, setName] = useState(hosting.name);
  const [description, setDescription] = useState(hosting.description);
  const [daily_price, setDailyPrice] = useState(String(hosting.daily_price));
  const [is_available, setIsAvailable] = useState(hosting.is_available);
  const [category, setCategory] = useState<Category | null>(
    hosting.category || null
  );
  const [address, setAddress] = useState<Address | null>(
    hosting.address || null
  );
  // const [doc, setDoc] = useState(hosting.doc || "");
  // const [photo, setPhoto] = useState(hosting.photo || "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(hosting.name);
    setDescription(hosting.description);
    setDailyPrice(String(hosting.daily_price));
    setIsAvailable(hosting.is_available);
    setCategory(hosting.category || null);
    setAddress(hosting.address || null);
    // setDoc(hosting.doc || "");
    // setPhoto(hosting.photo || "");
  }, [hosting]);

  useEffect(() => {
    // Buscar categorias e endereços para os pickers
    const fetchData = async () => {
      const catRes = await fetch("http://localhost:8000/categorias/");
      const catData = await catRes.json();
      setCategories(catData);

      const addrRes = await fetch("http://localhost:8000/enderecos/");
      const addrData = await addrRes.json();
      setAddresses(addrData);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!category || !address) return;
    setSaving(true);
    await fetch(`http://localhost:8000/hospedagens/${hosting.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        daily_price: Number(daily_price),
        is_available,
        category: category.id,
        address: address.id,
        // doc,
        // photo,
      }),
    });
    navigation.navigate("Hostings");
    setSaving(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar hospedagem</Text>
      <Text style={styles.label}>Nome</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 80 }]}
        multiline
      />
      <Text style={styles.label}>Preço diária</Text>
      <TextInput
        value={daily_price}
        onChangeText={setDailyPrice}
        style={styles.input}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Disponível</Text>
      <Switch value={is_available} onValueChange={setIsAvailable} />
      <Text style={styles.label}>Categoria</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={category?.id}
          onValueChange={(itemValue) => {
            const cat = categories.find((c) => c.id === itemValue);
            if (cat) setCategory(cat);
          }}
        >
          <Picker.Item label="Selecione..." value={undefined} />
          {categories.map((cat) => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
          ))}
        </Picker>
      </View>
      <Text style={styles.label}>Endereço</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={address?.id}
          onValueChange={(itemValue) => {
            const addr = addresses.find((a) => a.id === itemValue);
            if (addr) setAddress(addr);
          }}
        >
          <Picker.Item label="Selecione..." value={undefined} />
          {addresses.map((addr) => (
            <Picker.Item
              key={addr.id}
              label={`${addr.street}, ${addr.number} - ${addr.city}`}
              value={addr.id}
            />
          ))}
        </Picker>
      </View>
      {/* 
      <Text style={styles.label}>Documento</Text>
      <TextInput value={doc} onChangeText={setDoc} style={styles.input} />
      <Text style={styles.label}>Foto</Text>
      <TextInput value={photo} onChangeText={setPhoto} style={styles.input} />
      */}
      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
      )}
      <Button title="Voltar" onPress={() => navigation.navigate("Hostings")} />
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

export default EditHostingScreen;
