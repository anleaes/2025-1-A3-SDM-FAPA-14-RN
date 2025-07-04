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
import { Client } from "./ClientsScreen";

type Props = DrawerScreenProps<DrawerParamList, "CreateReservation">;

const statusOptions = [
  { label: "Confirmado", value: "CONFIRMED" },
  { label: "Pendente", value: "PENDING" },
  { label: "Cancelado", value: "CANCELED" },
];

const paymentOptions = [
  { label: "Cartão de Crédito", value: "CREDIT_CARD" },
  { label: "Cartão de Débito", value: "DEBIT_CARD" },
  { label: "PIX", value: "PIX" },
  { label: "Boleto", value: "PAYMENT_SLIP" },
];

const CreateReservationScreen = ({ navigation }: Props) => {
  const [checkin_date, setCheckinDate] = useState("");
  const [checkout_date, setCheckoutDate] = useState("");
  const [total_price, setTotalPrice] = useState("");
  const [status, setStatus] = useState<"CONFIRMED" | "PENDING" | "CANCELED">(
    "PENDING"
  );
  const [payment_method, setPaymentMethod] = useState<
    "CREDIT_CARD" | "DEBIT_CARD" | "PIX" | "PAYMENT_SLIP"
  >("CREDIT_CARD");
  const [client, setClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setCheckinDate("");
      setCheckoutDate("");
      setTotalPrice("");
      setStatus("PENDING");
      setPaymentMethod("CREDIT_CARD");
      setClient(null);
    }, [])
  );

  useEffect(() => {
    const fetchClients = async () => {
      const token = "b23dc8f982be9e338ce972afe6065768a61f6a2e";
      const res = await fetch("http://localhost:8000/clientes/", {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    };
    fetchClients();
  }, []);

  const handleSave = async () => {
    if (!client) return;
    setSaving(true);
    await fetch("http://localhost:8000/reservas/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checkin_date,
        checkout_date,
        total_price: Number(total_price),
        status,
        payment_method,
        client: client.id,
      }),
    });
    navigation.navigate("Reservations");
    setSaving(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nova reserva</Text>
      <Text style={styles.label}>Data de Check-in</Text>
      <TextInput
        value={checkin_date}
        onChangeText={setCheckinDate}
        style={styles.input}
        placeholder="YYYY-MM-DD"
      />
      <Text style={styles.label}>Data de Check-out</Text>
      <TextInput
        value={checkout_date}
        onChangeText={setCheckoutDate}
        style={styles.input}
        placeholder="YYYY-MM-DD"
      />
      <Text style={styles.label}>Valor total</Text>
      <TextInput
        value={total_price}
        onChangeText={setTotalPrice}
        style={styles.input}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Status do pagamento</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={status}
          onValueChange={(itemValue) => setStatus(itemValue)}
        >
          {statusOptions.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>
      <Text style={styles.label}>Método de pagamento</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={payment_method}
          onValueChange={(itemValue) => setPaymentMethod(itemValue)}
        >
          {paymentOptions.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>
      <Text style={styles.label}>Cliente</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={client?.id}
          onValueChange={(itemValue) => {
            const cli = clients.find((c) => c.id === itemValue);
            setClient(cli || null);
          }}
        >
          <Picker.Item label="Selecione..." value={undefined} />
          {clients.map((cli) => (
            <Picker.Item key={cli.id} label={cli.name} value={cli.id} />
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
        onPress={() => navigation.navigate("Reservations")}
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

export default CreateReservationScreen;
