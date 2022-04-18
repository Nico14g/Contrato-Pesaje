import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon } from "react-native-elements";
import Contratos from "../vistas/Contratos";
import TabProcesoContrato from "../vistas/TabProcesoContrato";
import EdicionContrato from "../vistas/EdicionContrato";
import { signOut } from "firebase/auth";
import { auth } from "../api/firebase";

const Stack = createNativeStackNavigator();

export default function ContratoStack(props) {
  const { setUser } = props;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Contratos"
        component={Contratos}
        options={{
          title: "Contratos",
          headerBackVisible: false,
          headerStyle: { backgroundColor: "#2f3bc7" },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            color: "white",
          },
          headerRight: () => (
            <Icon
              type="material-community"
              name="login-variant"
              size={25}
              color="white"
              onPress={() => signOut(auth).then(() => setUser(null))}
            />
          ),
        }}
      />
      <Stack.Screen
        name="TabProcesoContrato"
        component={TabProcesoContrato}
        options={{
          title: "Creación Contrato",
          headerBackVisible: true,
          headerStyle: { backgroundColor: "#2f3bc7" },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            color: "white",
          },
        }}
      />
      <Stack.Screen
        name="EdicionContrato"
        component={EdicionContrato}
        options={{
          title: "Editor Contrato",
          headerBackVisible: false,
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
