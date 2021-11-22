import React from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-elements";
import { size } from "lodash";

export default function ListaContratos(props) {
  const { contratos } = props;
  return (
    <ScrollView>
      {size(contratos) > 0 ? (
        <FlatList
          data={contratos}
          renderItem={(contrato) => <Contrato contrato={contrato} />}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.loaderContratos}>
          <ActivityIndicator size="large" />
          <Text>Cargando contratos</Text>
        </View>
      )}
    </ScrollView>
  );
}

function Contrato(props) {
  const { contrato } = props;
  return (
    <View>
      <Text>Contrato i</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  loaderContratos: { marginTop: 10, marginBottom: 10, alignItems: "center" },
});
