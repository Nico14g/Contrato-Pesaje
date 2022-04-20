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

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

const mostrarFechaTermino = (dateEnd) => {
  if (dateEnd === "") return true;
  return dateEnd.toDate().toLocaleDateString("es-CL", options);
};

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
          <View style={styles.colA}>
            <Text style={styles.nombreText}>
              {categoria.item.name.substr(0, 17)}
            </Text>
          </View>
          <View style={styles.colB}>
            {mostrarFechaTermino(categoria.item.dateEnd) === true ? (
              <Text style={styles.textoFecha}>En Progreso</Text>
            ) : (
              <Text style={styles.textoFecha}>
                {categoria.item.dateStart
                  .toDate()
                  .toLocaleDateString("es-CL", options)}{" "}
                - {mostrarFechaTermino(categoria.item.dateEnd)}
              </Text>
            )}
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
    height: 40,
  },
  colA: {
    width: "40%",
  },
  colB: {
    width: "40%",
  },
  colC: {
    alignSelf: "center",
    width: "30%",
  },
  textoFecha: {
    alignSelf: "center",
    marginTop: "7%",
  },
  nombreText: {
    fontWeight: "bold",
    marginTop: "7%",
  },
  texto: {
    fontSize: 18,
    marginBottom: 20,
  },
});
