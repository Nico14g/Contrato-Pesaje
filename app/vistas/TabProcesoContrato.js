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

export default function TabProcesoContrato() {
  const layout = useWindowDimensions();
  const [plantillaSelect, setPlantillaSelect] = useState("");
  const [index, setIndex] = useState(0);

  const [routes] = React.useState([
    { key: "plantilla", title: "Plantilla" },
    { key: "empresa", title: "Empresa" },
    { key: "empleado", title: "Empleado" },
    { key: "servicio", title: "Servicio" },
    { key: "anexos", title: "Otros" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "plantilla":
        return (
          <Plantilla
            setIndex={setIndex}
            plantillaSelect={plantillaSelect}
            setPlantillaSelect={setPlantillaSelect}
          />
        );
      case "empresa":
        return <Empresa setIndex={setIndex} />;
      case "empleado":
        return <Empleado setIndex={setIndex} />;
      case "servicio":
        return <Servicio setIndex={setIndex} />;
      case "anexos":
        return <Anexos />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    const changeView = (i) => {
      if (index > i) {
        setIndex(i);
      }
    };
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
              onPress={() => changeView(i)}
            >
              <Animated.Text style={{ opacity, color: "white" }}>
                {route.title}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <TabView
      swipeEnabled={false}
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
    alignItems: "center",
    backgroundColor: "#1565c0",
    height: "8%",
    flexDirection: "row",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
  },
});
