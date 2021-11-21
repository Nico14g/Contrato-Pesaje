import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Text, Button, Icon, SearchBar } from "react-native-elements";
import ListaContratos from "../components/contrato/ListaContratos";
export default function Contratos() {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.item}>
          <Text h2 style={styles.titulo}>
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
      <ListaContratos></ListaContratos>
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: { marginLeft: "1rem" },
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    marginBottom: "15px",
  },
  item: {
    width: "60%",
  },
  nuevo: {
    alignContent: "center",
    alignSelf: "center",
    alignItems: "center",
    width: "40%",
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
    marginTop: "15px",
    marginBottom: "15px",
    alignSelf: "center",
    alignItems: "centers",
    width: "90%",
    padding: "0",
  },
  inputSearchBar: {
    backgroundColor: "#ffffff",
  },
});

//f1f3f9
