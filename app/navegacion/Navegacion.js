import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import ContratoStack from "./ContratoStack";
import Pesaje from "../vistas/pesaje";

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="ContratoStack"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) =>
            screenOptions(focused, route, color),
          tabBarActiveTintColor: "#2f3bc7",
          tabBarInactiveTintColor: "#787878",
          //color secundario 99c781
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="ContratoStack"
          component={ContratoStack}
          options={{ title: "Contratos" }}
        />
        <Tab.Screen name="Pesaje" component={Pesaje} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function screenOptions(focused, route, color) {
  switch (route.name) {
    case "ContratoStack":
      return (
        <Icon
          type="material-community"
          name="file-document-edit"
          size={22}
          color={color}
        />
      );

    case "Pesaje":
      return (
        <Icon
          type="material-community"
          name="fruit-grapes-outline"
          size={27}
          color={color}
          style={{ transform: [{ rotateZ: "55deg" }] }}
        />
      );
    default:
      break;
  }
}
