import { Picker } from "@react-native-picker/picker";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
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
import { Hosting } from "./HostingsScreen";
import { Reservation } from "./ReservationsScreen";

type Props = DrawerScreenProps<DrawerParamList, "CreateReservationHosting">;

const CreateReservationHostingScreen = ({ navigation }: Props) => {
  const [quantity_days, setQuantityDays] = useState("");
  const [unit_price, setUnitPrice] = useState("");
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [hosting, setHosting] = useState<Hosting | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [hostings, setHostings] = useState<Hosting[]>([]);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setQuantityDays("");
      setUnitPrice("");
      setReservation(null);
      setHosting(null);
    }, [])
  );

  useEffect(() => {
    const fetchData = async () => {
      const resRes = await fetch("http://localhost:8000/reservas/");
      const resData = await resRes.json();
      setReservations(resData);

      const hosRes = await fetch("http://localhost:8000/hospedagens/");
      const hosData = await hosRes.json();
      setHostings(hosData);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!reservation || !hosting) return;
    setSaving(true);
    await fetch("http://localhost:8000/itens_reserva/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quantity_days: Number(quantity_days),
        unit_price: Number(unit_price),
        reservation: reservation.id,
        hosting: hosting.id,
      }),
    });
    navigation.navigate("ReservationHostings");
    setSaving(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Novo item de reserva</Text>
      <Text style={styles.label}>Dias</Text>
      <TextInput
        value={quantity_days}
        onChangeText={setQuantityDays}
        style={styles.input}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Valor unitário</Text>
      <TextInput
        value={unit_price}
        onChangeText={setUnitPrice}
        style={styles.input}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Reserva</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={reservation?.id}
          onValueChange={(itemValue) => {
            const res = reservations.find((r) => r.id === itemValue);
            setReservation(res || null);
          }}
        >
          <Picker.Item label="Selecione..." value={undefined} />
          {reservations.map((res) => (
            <Picker.Item
              key={res.id}
              label={`#${res.id} - ${res.client?.name}`}
              value={res.id}
            />
          ))}
        </Picker>
      </View>
      <Text style={styles.label}>Hospedagem</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={hosting?.id}
          onValueChange={(itemValue) => {
            const hos = hostings.find((h) => h.id === itemValue);
            setHosting(hos || null);
          }}
        >
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
      <Button
        title="Voltar"
        onPress={() => navigation.navigate("ReservationHostings")}
      />
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

export default CreateReservationHostingScreen;
