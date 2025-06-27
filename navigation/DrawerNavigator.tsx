import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import CustomDrawerContent from "../components/CustomDrawerContent";
import AddressScreen, { Address } from "../screens/AddressScreen";
import AmenitiesScreen, { Amenity } from "../screens/AmenitiesScreen";
import CategoriesScreen, { Category } from "../screens/CategoriesScreen";
import ClientsScreen, { Client } from "../screens/ClientsScreen";
import CreateAddressScreen from "../screens/CreateAddressScreen";
import CreateAmenityScreen from "../screens/CreateAmenityScreen";
import CreateCategoryScreen from "../screens/CreateCategoryScreen";
import CreateClientScreen from "../screens/CreateClientScreen";
import CreateHostingScreen from "../screens/CreateHostingScreen";
import CreateReservationHostingScreen from "../screens/CreateReservationHostingScreen";
import CreateReviewScreen from "../screens/CreateReviewScreen";
import EditAddressScreen from "../screens/EditAddressScreen";
import EditAmenityScreen from "../screens/EditAmenityScreen";
import EditCategoryScreen from "../screens/EditCategoryScreen";
import EditClientScreen from "../screens/EditClientScreen";
import EditHostingScreen from "../screens/EditHostingScreen";
import EditReservationHostingScreen from "../screens/EditReservationHostingScreen";
import EditReviewScreen from "../screens/EditReviewScreen";
import HomeScreen from "../screens/HomeScreen";
import HostingsScreen, { Hosting } from "../screens/HostingsScreen";
import ReservationHostingsScreen, {
  ReservationHosting,
} from "../screens/ReservationHostingScreen";
import ReviewsScreen, { Review } from "../screens/ReviewsScreen";

export type DrawerParamList = {
  Home: undefined;
  Categories: undefined;
  CreateCategory: undefined;
  EditCategory: { category: Category };
  Amenities: undefined;
  CreateAmenity: undefined;
  EditAmenity: { amenity: Amenity };
  Address: undefined;
  CreateAddress: undefined;
  EditAddress: { address: Address };
  Clients: undefined;
  CreateClient: undefined;
  EditClient: { client: Client };
  Hostings: undefined;
  CreateHosting: undefined;
  EditHosting: { hosting: Hosting };
  ReservationHostings: undefined;
  CreateReservationHosting: undefined;
  EditReservationHosting: { reservationHosting: ReservationHosting };
  Reviews: undefined;
  CreateReview: undefined;
  EditReview: { review: Review };
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: "#4B7BE5",
        drawerLabelStyle: { marginLeft: 0, fontSize: 16 },
        drawerStyle: { backgroundColor: "#fff", width: 250 },
        headerStyle: { backgroundColor: "#4B7BE5" },
        headerTintColor: "#fff",
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          title: "Início",
        }}
      />

      <Drawer.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="pricetags-outline" size={size} color={color} />
          ),
          title: "Categorias",
        }}
      />
      <Drawer.Screen
        name="CreateCategory"
        component={CreateCategoryScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Nova categoria",
        }}
      />
      <Drawer.Screen
        name="EditCategory"
        component={EditCategoryScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar categoria",
        }}
      />

      <Drawer.Screen
        name="Amenities"
        component={AmenitiesScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="construct-outline" size={size} color={color} />
          ),
          title: "Comodidades",
        }}
      />
      <Drawer.Screen
        name="CreateAmenity"
        component={CreateAmenityScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Nova comodidade",
        }}
      />
      <Drawer.Screen
        name="EditAmenity"
        component={EditAmenityScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar comodidade",
        }}
      />

      <Drawer.Screen
        name="Address"
        component={AddressScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="location-outline" size={size} color={color} />
          ),
          title: "Endereços",
        }}
      />
      <Drawer.Screen
        name="CreateAddress"
        component={CreateAddressScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Novo endereço",
        }}
      />
      <Drawer.Screen
        name="EditAddress"
        component={EditAddressScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar endereço",
        }}
      />

      <Drawer.Screen
        name="Clients"
        component={ClientsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          title: "Clientes",
        }}
      />
      <Drawer.Screen
        name="CreateClient"
        component={CreateClientScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Novo cliente",
        }}
      />
      <Drawer.Screen
        name="EditClient"
        component={EditClientScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar cliente",
        }}
      />

      <Drawer.Screen
        name="Hosting"
        component={HostingScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bed-outline" size={size} color={color} />
          ),
          title: "Hospedagens",
        }}
      />
      <Drawer.Screen
        name="CreateHosting"
        component={CreateHostingScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Nova hospedagem",
        }}
      />
      <Drawer.Screen
        name="EditHosting"
        component={EditHostingScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar hospedagem",
        }}
      />

      <Drawer.Screen
        name="ReservationHosting"
        component={ReservationHostingScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
          title: "Reservas de Hospedagem",
        }}
      />
      <Drawer.Screen
        name="CreateReservationHosting"
        component={CreateReservationHostingScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Nova reserva de hospedagem",
        }}
      />
      <Drawer.Screen
        name="EditReservationHosting"
        component={EditReservationHostingScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar reserva de hospedagem",
        }}
      />

      <Drawer.Screen
        name="ReservationHosting"
        component={ReservationHostingScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="clipboard-outline" size={size} color={color} />
          ),
          title: "Reservas",
        }}
      />
      <Drawer.Screen
        name="CreateReservationHosting"
        component={CreateReservationHostingScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Nova reserva",
        }}
      />
      <Drawer.Screen
        name="EditReservationHosting"
        component={EditReservationHostingScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar reserva",
        }}
      />

      <Drawer.Screen
        name="Reviews"
        component={ReviewsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
          title: "Avaliações",
        }}
      />
      <Drawer.Screen
        name="CreateReview"
        component={CreateReviewScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Nova avaliação",
        }}
      />
      <Drawer.Screen
        name="EditReview"
        component={EditReviewScreen}
        options={{
          drawerItemStyle: { display: "none" },
          title: "Editar avaliação",
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;