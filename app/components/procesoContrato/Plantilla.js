import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { Icon, SearchBar, Button } from "react-native-elements";
import { ListaPlantillas } from "../seleccionPlantilla/ListaPlantillas";
import * as DocumentPicker from "expo-document-picker";
import { storeData, readData } from "../../utilidades/variablesGlobales";

export default function Plantilla(props) {
  const { setIndex, plantillaSelect, setPlantillaSelect } = props;
  const [search, setSearch] = useState("");
  const [plantillas, setPlantillas] = useState([]);
  const componentMounted = useRef(true);
  const STORAGE_KEY = "@plantillas";

  useEffect(() => {
    if (componentMounted.current) {
      Promise.resolve(readData(STORAGE_KEY)).then((data) =>
        data === null ? null : setPlantillas(data)
      );
    }
    return () => {
      componentMounted.current = false;
    };
  }, []);

  let documentPicker = async () => {
    try {
      let archivo = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: [
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      });

      if (archivo.type === "cancel") {
        alert("Se ha cancelado la acción");
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
      storeData([...plantillas, archivo], STORAGE_KEY);
      Promise.resolve(readData(STORAGE_KEY)).then((data) =>
        data === null ? null : setPlantillas(data)
      );
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
