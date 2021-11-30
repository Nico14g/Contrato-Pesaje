import React from "react";
import Navigation from "./app/navegacion/Navegacion";
import { LogBox } from "react-native";

export default function App() {
  LogBox.ignoreLogs(["Setting a timer for a long period of time"]);
  return <Navigation />;
}
