import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon } from "react-native-elements";
import Contratos from "../vistas/Contratos";
import TabProcesoContrato from "../vistas/TabProcesoContrato";
import EdicionContrato from "../vistas/EdicionContrato";

import auth from "@react-native-firebase/auth";

const Stack = createNativeStackNavigator();

export default function ContratoStack(props) {
  const { setUser, user } = props;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Contratos"
        children={() => <Contratos user={user} />}
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
              onPress={() =>
                auth()
                  .signOut()
                  .then(() => setUser(null))
              }
            />
          ),
        }}
      />
      <Stack.Screen
        name="TabProcesoContrato"
        children={() => <TabProcesoContrato user={user} />}
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
        children={() => <EdicionContrato user={user} />}
        options={{
          title: "Editor Contrato",
          headerBackVisible: false,
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
