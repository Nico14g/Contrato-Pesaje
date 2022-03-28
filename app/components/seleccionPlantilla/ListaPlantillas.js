import React, { useState, useEffect, useRef } from "react";
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
import { storeData } from "../../utilidades/variablesGlobales";

export const ListaPlantillas = (props) => {
  const { plantillas, setIndex, plantillaSelect, setPlantillaSelect } = props;
  const [cargado, setCargado] = useState(false);
  const componentMounted = useRef(true);

  useEffect(() => {
    if (componentMounted.current) {
      setTimeout(() => {
        setCargado(true);
      }, 2000);
    }
    return () => {
      componentMounted.current = false;
    };
  }, []);

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
      ) : cargado ? (
        <View style={styles.loaderPlantilla}>
          <Text style={styles.texto}>No se han encontrado plantillas</Text>
          <Icon
            name="text-box-remove-outline"
            type="material-community"
            size={50}
          />
        </View>
      ) : (
        <View style={styles.loaderPlantilla}>
          <ActivityIndicator color="blue" size="large" />
          <Text>Cargando contratos</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

function Plantilla(props) {
  const { plantilla, setIndex, setPlantillaSelect } = props;
  const STORAGE_KEY = "@plantillaSelect";

  const seleccionarPlantilla = async () => {
    storeData(plantilla, STORAGE_KEY);
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
  texto: {
    fontSize: 18,
    marginBottom: 20,
  },
});
