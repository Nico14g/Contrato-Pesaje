import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { Icon, SearchBar, Button } from "react-native-elements";
import { ListaPlantillas } from "../seleccionPlantilla/ListaPlantillas";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Plantilla(props) {
  const { setIndex, plantillaSelect, setPlantillaSelect } = props;
  const [search, setSearch] = useState("");
  const [plantillas, setPlantillas] = useState([]);
  const STORAGE_KEY = "@plantillas";

  useEffect(() => {
    readData.apply();
  }, []);

  const readData = async () => {
    try {
      //const auxPlantillas = await AsyncStorage.getItem(STORAGE_KEY);
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      jsonValue !== null ? setPlantillas(JSON.parse(jsonValue)) : null;
    } catch (e) {
      alert("Se ha producido un fallo al recuperar las plantillas");
    }
  };

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      let a = await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      // saving error
    }
  };

  let documentPicker = async () => {
    try {
      let archivo = await DocumentPicker.getDocumentAsync({
        type: [
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      });

      if (archivo.type === "cancel") {
        alert("Se requiero permiso para acceder al documento");
        return;
      }

      if (
        Platform.OS !== "android" &&
        archivo.file.type !== "application/msword" &&
        archivo.file.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        alert("Se debe seleccionar un archivo de extensión .doc o .docx");
        return;
      }

      setPlantillas((plantillas) => [...plantillas, archivo]);
      storeData([...plantillas, archivo]);

      readData.apply();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.item}>
          <Text style={styles.subtitulo}>Selección plantilla</Text>
        </View>
        <View style={styles.nuevo}>
          <Button
            onPress={() => documentPicker()}
            buttonStyle={styles.boton}
            icon={
              <Icon
                type="material-community"
                name="plus"
                size={16}
                color="white"
              />
            }
            titleStyle={{ fontSize: 14 }}
            title="Agregar"
          />
        </View>
      </View>
      <SearchBar
        lightTheme
        containerStyle={styles.containerSearchBar}
        inputContainerStyle={styles.inputSearchBar}
        placeholder="Buscar Plantilla..."
        onChangeText={(e) => setSearch(e)}
        value={search}
      />

      <ListaPlantillas
        plantillas={
          search === ""
            ? plantillas
            : plantillas.filter((plantilla) =>
                plantilla.name.toLowerCase().includes(search.toLowerCase())
              )
        }
        setIndex={setIndex}
        plantillaSelect={plantillaSelect}
        setPlantillaSelect={setPlantillaSelect}
      />
    </>
  );
}

const styles = StyleSheet.create({
  subtitulo: {
    fontSize: 20,
    fontWeight: "600",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    maxHeight: "12%",
    marginTop: 20,
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
  boton: {
    width: 80,
    height: 36,
    backgroundColor: "#99c781",
    borderColor: "#3f9d2f",
    shadowOffset: { width: -1, height: 3 },
    shadowRadius: 4,
    shadowColor: "gray",
    borderRadius: 20,
  },

  containerSearchBar: {
    maxHeight: "10%",
    alignSelf: "center",
    width: "90%",
    padding: 0,
  },
  inputSearchBar: {
    backgroundColor: "#ffffff",
    padding: 0,
  },
  mainConatinerStyle: {
    flexDirection: "column",
    flex: 1,
  },
});
