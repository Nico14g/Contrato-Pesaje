import React, { useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import Anexos from "../components/procesoContrato/Anexos";
import Empleado from "../components/procesoContrato/Empleado";
import Empresa from "../components/procesoContrato/Empresa";
import Plantilla from "../components/procesoContrato/Plantilla";
import Servicio from "../components/procesoContrato/Servicio";
import Constants from "expo-constants";

const PrimeraRuta = () => <Plantilla />;

const SegundaRuta = () => <Empresa />;

const TerceraRuta = () => <Empleado />;

const CuartaRuta = () => <Servicio />;

const QuintaRuta = () => <Anexos />;

const renderScene = SceneMap({
  plantilla: PrimeraRuta,
  empresa: SegundaRuta,
  empleado: TerceraRuta,
  servicio: CuartaRuta,
  anexos: QuintaRuta,
});

export default function TabProcesoContrato() {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = React.useState([
    { key: "plantilla", title: "Plantilla" },
    { key: "empresa", title: "Empresa" },
    { key: "empleado", title: "Empleado" },
    { key: "servicio", title: "Servicio" },
    { key: "anexos", title: "Otros" },
  ]);

  const renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) =>
              inputIndex === i ? 1 : 0.5
            ),
          });

          return (
            <TouchableOpacity
              key={i}
              style={styles.tabItem}
              onPress={() => setIndex(i)}
            >
              <Animated.Text style={{ opacity }}>{route.title}</Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={renderTabBar}
      initialLayout={{ width: layout.width }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    paddingTop: Constants.statusBarHeight,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
});
