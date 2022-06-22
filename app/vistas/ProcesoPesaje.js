import React, { useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import Pesaje from "../components/procesoPesaje/Pesaje";
import Categoria from "../components/procesoPesaje/Categoria";
import Historial from "../components/procesoPesaje/Historial";

export default function ProcesoPesaje(props) {
  const { user } = props;
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const [routes] = React.useState([
    { key: "categoria", title: "Categoría" },
    { key: "pesaje", title: "Pesaje" },
    { key: "historial", title: "Historial" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "categoria":
        return <Categoria index={index} setIndex={setIndex} user={user} />;
      case "pesaje":
        return <Pesaje index={index} setIndex={setIndex} user={user} />;
      case "historial":
        return <Historial index={index} setIndex={setIndex} user={user} />;
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
      if (index === 1 && i === 2) {
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
