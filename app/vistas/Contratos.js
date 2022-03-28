import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Text, Button, Icon, SearchBar } from "react-native-elements";
import ListaContratos from "../components/contrato/ListaContratos";
import { readData } from "../utilidades/variablesGlobales";

export default function Contratos() {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [contratosCreados, setContratosCreados] = useState([]);
  const componentMounted = useRef(true);
  const [cargado, setCargado] = useState(false);
  const STORAGE_KEY = "@contratosCreados";

  useEffect(async () => {
    setCargado(false);
    if (componentMounted.current) {
      setTimeout(() => {
        Promise.resolve(readData(STORAGE_KEY)).then((data) =>
          data === null ? null : setContratosCreados(data)
        );
      }, 1000);
      setCargado(true);
    }
    return () => {
      componentMounted.current = false;
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        Promise.resolve(readData(STORAGE_KEY)).then((data) =>
          data === null ? null : setContratosCreados(data)
        );
      }, 1000);
    }, [])
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.item}>
          <Text h3 style={styles.titulo}>
            Documentos
          </Text>
        </View>
        <View style={styles.nuevo}>
          <Button
            onPress={() => navigation.navigate("TabProcesoContrato")}
            buttonStyle={styles.boton}
            icon={
              <Icon
                type="material-community"
                name="plus"
                size={20}
                color="white"
              />
            }
            titleStyle={{ fontSize: 14 }}
            title="Nuevo"
          />
        </View>
      </View>

      <SearchBar
        lightTheme
        containerStyle={styles.containerSearchBar}
        inputContainerStyle={styles.inputSearchBar}
        placeholder="Buscar documento..."
        onChangeText={(e) => setSearch(e)}
        value={search}
      />
      <ListaContratos
        contratos={
          search === ""
            ? contratosCreados
            : contratosCreados.filter((contrato) =>
                contrato.filename.toLowerCase().includes(search.toLowerCase())
              )
        }
      ></ListaContratos>
    </>
  );
}

const styles = StyleSheet.create({
  titulo: { marginLeft: "7%" },
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    maxHeight: "10%",
  },
  item: {
    width: "60%",
  },
  nuevo: {
    alignItems: "center",
    width: "40%",
  },
  boton: {
    width: 80,
    height: 35,
    marginTop: 10,
    backgroundColor: "#99c781",
    borderColor: "#3f9d2f",
    shadowOffset: { width: -1, height: 4 },
    shadowRadius: 6,
    shadowColor: "gray",
    borderRadius: 20,
  },
  containerSearchBar: {
    marginTop: 15,
    marginBottom: 15,
    alignSelf: "center",
    alignItems: "center",
    width: "90%",
    padding: 0,
  },
  inputSearchBar: {
    backgroundColor: "#ffffff",
  },
});

//f1f3f9
