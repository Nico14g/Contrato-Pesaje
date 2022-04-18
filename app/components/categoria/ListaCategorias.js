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
import { Card, Icon } from "react-native-elements";
import { storeData } from "../../utilidades/variablesGlobales";

import { size } from "lodash";

export default function ListaCategorias(props) {
  const { categorias, setIndex } = props;
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
      {size(categorias) > 0 ? (
        <FlatList
          data={categorias}
          renderItem={(categoria) => (
            <Categoria categoria={categoria} setIndex={setIndex} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : cargado ? (
        <View style={styles.loaderContratos}>
          <Text style={styles.texto}>No se han encontrado categorías</Text>
          <Icon
            name="text-box-remove-outline"
            type="material-community"
            size={50}
          />
        </View>
      ) : (
        <View style={styles.loaderContratos}>
          <ActivityIndicator color="blue" size="large" />
          <Text>Cargando categorías</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

function Categoria(props) {
  const { categoria, setIndex } = props;
  const STORAGE_KEY = "@categoriaSelect";
  const seleccionarCategoria = async () => {
    storeData(categoria, STORAGE_KEY);
    setIndex(1);
  };
  return (
    <TouchableOpacity onPress={() => seleccionarCategoria()}>
      <Card>
        <View style={styles.viewContainer}>
          <View style={styles.colB}>
            <Text style={styles.nombreText}>
              {categoria.item.name.substr(0, 25)}
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
    width: "80%",
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
