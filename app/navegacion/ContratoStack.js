import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Contratos from "../vistas/contratos";
import TabProcesoContrato from "../vistas/TabProcesoContrato";
import EdicionContrato from "../vistas/EdicionContrato";

const Stack = createNativeStackNavigator();

export default function ContratoStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Contratos"
        component={Contratos}
        options={{
          title: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#f1f3f9" },
          headerTitleStyle: {
            color: "black",
            fontSize: "30px",
            marginTop: 30,
          },
        }}
      />
      <Stack.Screen
        name="TabProcesoContrato"
        component={TabProcesoContrato}
        options={{ title: "Creación Contrato", headerBackVisible: true }}
      />
      <Stack.Screen
        name="EdicionContrato"
        component={EdicionContrato}
        options={{ title: "Editor Contrato", headerBackVisible: true }}
      />
    </Stack.Navigator>
  );
}
