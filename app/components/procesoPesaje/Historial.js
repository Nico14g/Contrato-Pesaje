import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Text, SearchBar } from "react-native-elements";
import firestore from "@react-native-firebase/firestore";
import ModalCategoria from "../../components/categoria/ModalCategoria";
import { SnackBar } from "../../utilidades/Snackbar";
import { readData } from "../../utilidades/variablesGlobales";
import ListaHistorial from "./listaHistorial";
import { formatRut, RutFormat } from "@fdograph/rut-utilities";

export default function Historial(props) {
  const { index, setIndex, user } = props;
  const [search, setSearch] = useState("");
  const componentMounted = useRef(true);
  const [categorias, setCategorias] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [registros, setRegistros] = useState([]);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [categoriaSelected, setCategoriaSelected] = useState("");

  const STORAGE_KEY = "@categoriaSelect";

  useEffect(() => {
    Promise.resolve(readData(STORAGE_KEY)).then((data) =>
      data === null ? null : setCategoriaSelected(data)
    );
  }, [index]);

  useEffect(() => {
    if (categoriaSelected.item !== "" && categoriaSelected.item !== undefined) {
      setLoaded(false);
      let registros = [];
      firestore()
        .collection(
          "categoria/" + categoriaSelected.item.idCategoria + "/registros"
        )
        .onSnapshot((querySnapshot2) => {
          querySnapshot2.forEach((doc2) => {
            let registrosTemporero = [];
            firestore()
              .collection(
                "categoria/" +
                  categoriaSelected.item.idCategoria +
                  "/registros/" +
                  doc2.id +
                  "/registrosTemporero"
              )
              .onSnapshot((querySnapshot3, i) => {
                querySnapshot3.forEach((doc3) => {
                  registrosTemporero.push(doc3.data());
                });
                registros.push({
                  ...doc2.data(),
                  registrosTemporero: registrosTemporero,
                });
                setRegistros(registros);
                setLoaded(true);
              });
          });
        });
    }
  }, [user.uid, user.cuid, user.rol, user.rut, index]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.item}>
          <Text h4>Historial Cosecha</Text>
        </View>
      </View>
      <SearchBar
        lightTheme
        containerStyle={styles.containerSearchBar}
        inputContainerStyle={styles.inputSearchBar}
        placeholder="Buscar temporero..."
        onChangeText={(e) => setSearch(e)}
        value={search}
      />

      {loaded && (
        <ListaHistorial
          registros={
            search === ""
              ? registros
              : registros.filter(
                  (registro) =>
                    registro.nombreTemporero
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    registro.apellidoTemporero
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    formatRut(registro.idRegistro, RutFormat.DASH)
                      .toLowerCase()
                      .includes(search.toLowerCase())
                )
          }
          setIndex={setIndex}
        ></ListaHistorial>
      )}
      {open && (
        <ModalCategoria
          open={open}
          setOpen={setOpen}
          user={user}
          setOpenSnackbar={setOpenSnackbar}
          setMessage={setMessage}
        />
      )}
      {openSnackbar && (
        <SnackBar
          open={openSnackbar}
          setOpen={setOpenSnackbar}
          message={message}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    maxHeight: "12%",
    marginTop: 20,
    alignSelf: "center",
  },

  item: {
    flexDirection: "row-reverse",
    alignSelf: "center",
  },

  nuevo: {
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
