import React from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { Card, Icon } from "react-native-elements";
import { size } from "lodash";
import Word from "../../../assets/imagenes/word.png";
import { SafeAreaView } from "react-native-safe-area-context";

export const ListaPlantillas = (props) => {
  const { plantillas, setIndex, plantillaSelect, setPlantillaSelect } = props;
  return (
    <SafeAreaView style={styles.container}>
      {size(plantillas) > 0 ? (
        <FlatList
          data={plantillas}
          renderItem={(plantilla) => (
            <Plantilla
              plantilla={plantilla}
              setIndex={setIndex}
              setPlantillaSelect={setPlantillaSelect}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.loaderPlantilla}>
          <ActivityIndicator color="blue" size="large" />
          <Text>Cargando plantillas</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

//<Text>{plantilla.item}</Text>
//<Text> {plantilla.index} </Text>

function Plantilla(props) {
  const { plantilla, setIndex, setPlantillaSelect } = props;

  const seleccionarPlantilla = () => {
    setPlantillaSelect(plantilla);
    setIndex(1);
  };
  return (
    <TouchableOpacity onPress={() => seleccionarPlantilla()}>
      <Card>
        <View style={styles.viewContainer}>
          <View style={styles.colA}>
            <Image source={Word} style={{ width: 50, height: 50 }} />
          </View>
          <View style={styles.colB}>
            <Text style={styles.nombreText}>
              {plantilla.item.name.substr(0, 25)}
            </Text>
            <Text>
              Tamaño {(plantilla.item.size / 1048576).toFixed(2)} {" MB"}
            </Text>
          </View>
          <View style={styles.colC}>
            <Icon name="chevron-right" type="material-community" size={30} />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: { maxHeight: "70%", minHeight: "70%" },
  viewContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  colA: {
    width: "20%",
  },
  colB: {
    alignItems: "flex-start",
    alignSelf: "center",
    width: "60%",
  },
  colC: {
    alignSelf: "center",
    width: "20%",
  },
  loaderPlantilla: { marginTop: 10, marginBottom: 10, alignItems: "center" },
  nombreText: {
    fontWeight: "bold",
  },
});
