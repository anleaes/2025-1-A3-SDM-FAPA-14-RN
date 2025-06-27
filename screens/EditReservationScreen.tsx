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

type Props = DrawerScreenProps<DrawerParamList, "EditReservation">;

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

const EditReservationScreen = ({ route, navigation }: Props) => {
  const { reservation } = route.params;

  const [checkin_date, setCheckinDate] = useState(reservation.checkin_date);
  const [checkout_date, setCheckoutDate] = useState(reservation.checkout_date);
  const [total_price, setTotalPrice] = useState(
    String(reservation.total_price)
  );
  const [status, setStatus] = useState<"CONFIRMED" | "PENDING" | "CANCELED">(
    reservation.status
  );
  const [payment_method, setPaymentMethod] = useState<
    "CREDIT_CARD" | "DEBIT_CARD" | "PIX" | "PAYMENT_SLIP"
  >(reservation.payment_method);
  const [client, setClient] = useState<Client | null>(
    reservation.client || null
  );
  const [clients, setClients] = useState<Client[]>([]);
  const [saving, setSaving] = useState(false);

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
    await fetch(`http://localhost:8000/reservas/${reservation.id}/`, {
      method: "PUT",
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
      <Text style={styles.title}>Editar Reserva</Text>

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

      <Text style={styles.label}>Valor Total</Text>
      <TextInput
        value={total_price}
        onChangeText={setTotalPrice}
        style={styles.input}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Status</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={status} onValueChange={setStatus}>
          {statusOptions.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Método de Pagamento</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={payment_method} onValueChange={setPaymentMethod}>
          {paymentOptions.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Cliente</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={client?.id}
          onValueChange={(id) => {
            const selected = clients.find((c) => c.id === id) || null;
            setClient(selected);
          }}
        >
          <Picker.Item label="Selecione..." value={undefined} />
          {Array.isArray(clients) &&
            clients.map((c) => (
              <Picker.Item key={c.id} label={c.name} value={c.id} />
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

export default EditReservationScreen;
