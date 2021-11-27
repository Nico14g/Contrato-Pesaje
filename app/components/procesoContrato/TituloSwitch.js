import React, { useState } from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import { Switch } from "react-native-elements";
import { FormularioEmpresa } from "../formularios/FormularioEmpresa";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export const TituloSwitch = (props) => {
  const { isEnabled, toggleSwitch, title } = props;
  //const [isEnabled, setIsEnabled] = useState(false);
  //const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
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
    paddingTop: 15,
    paddingBottom: 20,
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
