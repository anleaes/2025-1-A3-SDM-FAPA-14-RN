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
  { label: "Confirmado", value: "confirmed" },
  { label: "Pendente", value: "pending" },
  { label: "Cancelado", value: "canceled" },
];

const paymentOptions = [
  { label: "Cartão de Crédito", value: "credit_card" },
  { label: "Cartão de Débito", value: "debit_card" },
  { label: "PIX", value: "Pix" },
  { label: "Boleto", value: "payment_slip" },
];

const EditReservationScreen = ({ route, navigation }: Props) => {
  const { reservation } = route.params;
  const [checkin_date, setCheckinDate] = useState(reservation.checkin_date);
  const [checkout_date, setCheckoutDate] = useState(reservation.checkout_date);
  const [total_price, setTotalPrice] = useState(
    String(reservation.total_price)
  );
  const [status, setStatus] = useState<"confirmed" | "pending" | "canceled">(
    reservation.status
  );
  const [payment_method, setPaymentMethod] = useState<
    "credit_card" | "debit_card" | "Pix" | "payment_slip"
  >(reservation.payment_method);
  const [client, setClient] = useState<Client>(reservation.client);
  // const [doc, setDoc] = useState(reservation.doc || "");
  const [clients, setClients] = useState<Client[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCheckinDate(reservation.checkin_date);
    setCheckoutDate(reservation.checkout_date);
    setTotalPrice(String(reservation.total_price));
    setStatus(reservation.status);
    setPaymentMethod(reservation.payment_method);
    setClient(reservation.client);
    // setDoc(reservation.doc || "");
  }, [reservation]);

  useEffect(() => {
    const fetchClients = async () => {
      const response = await fetch("http://localhost:8000/clientes/");
      const data = await response.json();
      setClients(data);
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
        // doc,
      }),
    });
    navigation.navigate("Reservations");
    setSaving(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar reserva</Text>
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
            if (cli) setClient(cli);
          }}
        >
          <Picker.Item label="Selecione..." value={undefined} />
          {clients.map((cli) => (
            <Picker.Item key={cli.id} label={cli.name} value={cli.id} />
          ))}
        </Picker>
      </View>
      {/* 
      <Text style={styles.label}>Documento</Text>
      <TextInput value={doc} onChangeText={setDoc} style={styles.input} />
      */}
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
