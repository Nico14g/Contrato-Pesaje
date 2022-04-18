import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProcesoPesaje from "../vistas/ProcesoPesaje";
import { Icon } from "react-native-elements";
import { signOut } from "firebase/auth";
import { auth } from "../api/firebase";

const Stack = createNativeStackNavigator();

export default function PesajeStack(props) {
  const { user, setUser } = props;
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="procesoPesaje"
        children={() => <ProcesoPesaje user={user} />}
        options={{
          title: "Pesaje de Fruta",
          headerBackVisible: true,
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
    </Stack.Navigator>
  );
}
