import React, { useEffect, useState, useRef } from "react";

import {
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Image, Card, Icon } from "react-native-elements";
import { storeData } from "../../utilidades/variablesGlobales";
import { size } from "lodash";
import Word from "../../../assets/imagenes/word.png";

export default function ListaContratos(props) {
  const { contratos } = props;
  const navigation = useNavigation();
  const componentMounted = useRef(true);
  const [cargado, setCargado] = useState(false);

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
      {size(contratos) > 0 ? (
        <FlatList
          data={contratos}
          renderItem={(contrato) => (
            <Contrato contrato={contrato} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : cargado ? (
        <View style={styles.loaderContratos}>
          <Text style={styles.texto}>No se han encontrado contratos</Text>
          <Icon
            name="text-box-remove-outline"
            type="material-community"
            size={50}
          />
        </View>
      ) : (
        <View style={styles.loaderContratos}>
          <ActivityIndicator color="blue" size="large" />
          <Text>Cargando contratos</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

function Contrato(props) {
  const { contrato, navigation } = props;
  const STORAGE_KEY = "@plantillaSelect";

  console.log(contrato);
  const seleccionarPlantilla = async () => {
    storeData(contrato, STORAGE_KEY);
    navigation.navigate("EdicionContrato");
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
              {contrato.item.fileName.substr(0, 25)}
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
  container: {
    maxHeight: "70%",
    minHeight: "70%",
  },
  loaderContratos: {
    paddingTop: 20,
    alignItems: "center",
  },
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

  nombreText: {
    fontWeight: "bold",
  },
  texto: {
    fontSize: 18,
    marginBottom: 20,
  },
});
