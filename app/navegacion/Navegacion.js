import React, { useEffect, useState, useRef } from "react";
import { Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import pesajeActive from "../../assets/imagenes/pesaje-active.png";
import pesajeInactive from "../../assets/imagenes/pesaje-inactive.png";
import ContratoStack from "./ContratoStack";
import PesajeStack from "./pesajeStack";
import Login from "../vistas/Login";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function Navigation() {
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        firestore()
          .collection("usuarios")
          .doc(user.uid)
          .onSnapshot((doc) => setUser(doc.data()));
      }
    });

    return unsubscribe;
  }, []);

  if (user) {
    if (user?.rol === "admin" || user?.rol === "company") {
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
              children={() => <ContratoStack user={user} setUser={setUser} />}
              options={{
                title: "Contratos",
              }}
            />
            <Tab.Screen
              name="Pesaje"
              children={() => <PesajeStack user={user} setUser={setUser} />}
              options={{
                title: "Pesaje",
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      );
    } else {
      return (
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="Pesaje"
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
              name="Pesaje"
              children={() => <PesajeStack user={user} setUser={setUser} />}
              options={{
                title: "Pesaje",
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      );
    }
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="login"
            component={Login}
            options={{
              title: "Login",
              headerBackVisible: false,
              headerShown: false,
              headerStyle: { backgroundColor: "#2f3bc7" },
              headerTintColor: "#ffffff",
              headerTitleStyle: {
                color: "white",
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
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
      if (focused) {
        return (
          <Image source={pesajeActive} style={{ width: 25, height: 25 }} />
        );
      } else {
        return (
          <Image source={pesajeInactive} style={{ width: 25, height: 25 }} />
        );
      }

    default:
      break;
  }
}
