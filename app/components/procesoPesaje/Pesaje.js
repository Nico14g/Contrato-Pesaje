import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Icon, Button, Text, Divider } from "react-native-elements";
import { Title } from "react-native-paper";
import { useFormik } from "formik";
import Autocomplete from "react-native-autocomplete-input";
import FormularioTemporero from "./FormularioTemporero";
import NfcScan from "./nfc/NfcScan";

export default function Pesaje(props) {
  const { setIndex, user } = props;
  const componentMounted = useRef(true);
  const [bandeja, setBandeja] = useState({
    nombre: "",
    id: "",
    dcto: 0,
    cuid: user.rol === "company" ? user.uid : user.cuid,
  });
  useEffect(() => {
    if (componentMounted.current) {
      console.log("hola");
    }
    return () => {
      componentMounted.current = false;
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      run: "",
      nombre: "",
      id: "",
      dcto: 0,
      cuid: "",
      weight: 0,
      originalWeight: 0,
    },
  });

  const { values } = formik;

  return (
    <>
      <View style={styles.container}>
        <View style={styles.item}>
          <Text h4>Pesaje de fruta</Text>
        </View>
      </View>
      <Divider
        inset={true}
        insetType={"middle"}
        color={"blue"}
        style={{ alignItems: "center" }}
      >
        <Title>Información del Empleado</Title>
      </Divider>
      <View style={styles.containerButtons}>
        <Button
          onPress={() => console.log("hola")}
          buttonStyle={styles.boton}
          icon={
            <Icon
              type="material-community"
              name="nfc"
              size={20}
              color="white"
            />
          }
          titleStyle={{ fontSize: 14 }}
          title=" Enlazar Temporero"
        />

        <Button
          onPress={() => console.log("hola")}
          buttonStyle={styles.boton}
          icon={
            <Icon
              type="material-community"
              name="cellphone-nfc"
              size={20}
              color="white"
            />
          }
          titleStyle={{ fontSize: 14 }}
          title=" Leer NFC"
        />
      </View>
      <FormularioTemporero formik={formik} />
      <Divider
        inset={true}
        insetType={"middle"}
        color={"blue"}
        style={{ alignItems: "center" }}
      >
        <Title>Información del Pesaje</Title>
      </Divider>

      <NfcScan />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    maxHeight: "8%",
    marginTop: 20,
  },

  containerButtons: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    marginBottom: 10,
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
    width: Dimensions.get("window").width * 0.42,
    height: 36,
    backgroundColor: "#99c781",
    borderColor: "#3f9d2f",
    shadowOffset: { width: -1, height: 3 },
    shadowRadius: 4,
    shadowColor: "gray",
    margin: 10,
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
