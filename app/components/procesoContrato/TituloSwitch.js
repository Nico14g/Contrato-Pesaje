import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Switch } from "react-native-elements";

export const TituloSwitch = (props) => {
  const { isEnabled, toggleSwitch, title } = props;
  return (
    <>
      <View style={styles.container}>
        <View style={styles.item}>
          <Text style={styles.subtitulo}>{title}</Text>
        </View>
        <View style={styles.nuevo}>
          <Switch
            thumbColor="#f4f3f4"
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleSwitch()}
            value={isEnabled}
          />
          <Text>Existente</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  subtitulo: {
    fontSize: 20,
    fontWeight: "600",
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    paddingBottom: 10,
  },

  item: {
    width: "70%",
    flexDirection: "row-reverse",
    alignSelf: "center",
  },
  nuevo: {
    alignSelf: "center",
    alignItems: "center",
    width: "30%",
  },
});
