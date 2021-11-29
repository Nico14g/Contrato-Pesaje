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
  const [empresa, setEmpresa] = useState({
    cargoRepresentante: "",
    ciudad: "",
    direccion: "",
    razonSocial: "",
    representante: "",
    rutRazonSocial: "",
    rutRepresentante: "",
  });

  const [routes] = React.useState([
    { key: "plantilla", title: "Plantilla" },
    { key: "empresa", title: "Empresa" },
    { key: "empleado", title: "Empleado" },
    { key: "servicio", title: "Servicio" },
    { key: "anexos", title: "Otros" },
  ]);

  const PrimeraRuta = () => (
    <Plantilla
      setIndex={setIndex}
      plantillaSelect={plantillaSelect}
      setPlantillaSelect={setPlantillaSelect}
    />
  );

  const SegundaRuta = () => (
    <Empresa empresa={empresa} setEmpresa={setEmpresa} setIndex={setIndex} />
  );

  const TerceraRuta = () => <Empleado setIndex={setIndex} />;

  const CuartaRuta = () => <Servicio setIndex={setIndex} />;

  const QuintaRuta = () => <Anexos />;

  const renderScene = SceneMap({
    plantilla: PrimeraRuta,
    empresa: SegundaRuta,
    empleado: TerceraRuta,
    servicio: CuartaRuta,
    anexos: QuintaRuta,
  });

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
              onPress={() => console.log("a")}
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
    height: "10%",
    flexDirection: "row",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
  },
});
