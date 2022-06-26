import "expo-dev-client";

import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import firestore, { firebase } from "@react-native-firebase/firestore";

async function bootstrap() {
  await firestore().settings({
    persistence: true,
    cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
  });
}

import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
bootstrap();
registerRootComponent(App);
