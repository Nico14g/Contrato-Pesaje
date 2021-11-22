import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { FAB, Icon, SearchBar, Button } from "react-native-elements";
import { ListaPlantillas } from "../seleccionPlantilla/ListaPlantillas";

export default function Plantilla() {
  const [search, setSearch] = useState("");
  return (
    <>
      <View style={styles.container}>
        <View style={styles.item}>
          <Text style={styles.subtitulo}>Selección plantilla</Text>
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
      <>
        <ListaPlantillas />
      </>
    </>
  );
}

const styles = StyleSheet.create({
  subtitulo: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: "15px",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    maxHeight: "15%",
  },
  item: {
    width: "70%",
    flexDirection: "row-reverse",
    alignSelf: "center",
  },
  nuevo: {
    marginTop: "2%",
    alignSelf: "center",
    alignItems: "center",
    width: "30%",
  },
  boton: {
    width: "100px",
    height: "32px",
    marginTop: "10px",
    backgroundColor: "#99c781",
    borderColor: "#3f9d2f",
    shadowOffset: { width: -1, height: 3 },
    shadowRadius: 4,
    shadowColor: "gray",
    borderRadius: "20px",
  },

  containerSearchBar: {
    marginBottom: "15px",
    alignSelf: "center",
    alignItems: "centers",
    width: "90%",
    padding: "0",
  },
  inputSearchBar: {
    backgroundColor: "#ffffff",
  },
  mainConatinerStyle: {
    flexDirection: "column",
    flex: 1,
  },
});
