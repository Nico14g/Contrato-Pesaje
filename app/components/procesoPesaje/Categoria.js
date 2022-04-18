import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Icon, Button, Text, SearchBar } from "react-native-elements";

import { db } from "../../api/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import ListaCategorias from "../categoria/ListaCategorias";
import ModalCategoria from "../../components/categoria/ModalCategoria";
import { SnackBar } from "../../utilidades/Snackbar";

export default function Categoria(props) {
  const { setIndex, user } = props;
  const [search, setSearch] = useState("");
  const componentMounted = useRef(true);
  const [cagando, setCargado] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setCargado(false);
    if (componentMounted.current) {
      const cuid = user.rol === "company" ? user.uid : user.cuid;

      const q = query(collection(db, "category"), where("cuid", "==", cuid));

      onSnapshot(q, (querySnapshot) => {
        let categorias = [];

        querySnapshot.forEach((doc) => {
          let registers = [];
          onSnapshot(collection(doc.ref, "registers"), (querySnapshot2) => {
            querySnapshot2.forEach((doc2) => {
              let workerRegisters = [];

              onSnapshot(
                collection(doc2.ref, "workerRegisters"),
                (querySnapshot3) => {
                  querySnapshot3.forEach((doc3) => {
                    workerRegisters.push(doc3.data());
                  });
                  registers.push(
                    Object.assign(doc2.data(), { workerRegisters })
                  );
                }
              );
            });
          });
          categorias.push(Object.assign(doc.data(), { registers }));
        });
        setCategorias(categorias);
      });
      setCargado(true);
    }
    return () => {
      componentMounted.current = false;
    };
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.item}>
          <Text h4>Selección de Categoría</Text>
        </View>
        <View style={styles.nuevo}>
          <Button
            onPress={() => setOpen(true)}
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
            title="Añadir"
          />
        </View>
      </View>
      <SearchBar
        lightTheme
        containerStyle={styles.containerSearchBar}
        inputContainerStyle={styles.inputSearchBar}
        placeholder="Buscar categoría..."
        onChangeText={(e) => setSearch(e)}
        value={search}
      />

      <ListaCategorias
        categorias={
          search === ""
            ? categorias
            : categorias.filter((categoria) =>
                categoria.name.toLowerCase().includes(search.toLowerCase())
              )
        }
        setIndex={setIndex}
      ></ListaCategorias>
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
  },

  item: {
    width: "70%",
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
