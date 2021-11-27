import React, { useState } from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import { Switch } from "react-native-elements";
import { FormularioEmpresa } from "../formularios/FormularioEmpresa";
import { TituloSwitch } from "./TituloSwitch";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Empresa(props) {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  return (
    <>
      <TituloSwitch
        isEnabled={isEnabled}
        toggleSwitch={toggleSwitch}
        title="Datos Empresa"
      />
      <FormularioEmpresa />
    </>
  );
}

const styles = StyleSheet.create({});

/*<View style={styles.container}>
        <View style={styles.item}>
          <Text style={styles.subtitulo}>Datos Empresa</Text>
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
      </View>*/
