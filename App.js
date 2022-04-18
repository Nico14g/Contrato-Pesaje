import React from "react";
import Navigation from "./app/navegacion/Navegacion";
import { LogBox } from "react-native";

export default function App() {
  LogBox.ignoreLogs(["Setting a timer for a long period of time"]);
  LogBox.ignoreLogs([
    "AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage",
  ]);
  LogBox.ignoreLogs([
    "Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.",
  ]);

  return <Navigation />;
}
