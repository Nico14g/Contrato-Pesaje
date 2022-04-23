import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
} from "react-native";
import { Icon, Button, Text, Divider } from "react-native-elements";
import { Title } from "react-native-paper";
import { useFormik } from "formik";
import Autocomplete from "react-native-autocomplete-input";
import FormularioTemporero from "./FormularioTemporero";
import NfcScan from "./nfc/NfcScan";
import { db } from "../../api/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import FormularioPesaje from "./FormularioPesaje";
import LecturaNFC from "./nfc/LecturaNFC";

export default function Pesaje(props) {
  const { setIndex, user } = props;
  const componentMounted = useRef(true);
  const [bandejas, setBandejas] = useState([]);
  const [mostrarLecturaNFC, setMostrarLecturaNFC] = useState(false);

  useEffect(() => {
    if (componentMounted.current) {
      const cuid = user.rol === "bandeja" ? user.uid : user.cuid;
      const q = query(collection(db, "bandeja"), where("cuid", "==", cuid));
      onSnapshot(q, (querySnapshot) => {
        let bandejas = [];
        querySnapshot.forEach((doc) => {
          if (doc.data().run !== user.run) {
            bandejas.push(doc.data());
          }
        });
        setBandejas(bandejas);
      });
    }
    return () => {
      componentMounted.current = false;
    };
  }, [user.uid, user.cuid, user.rol, user.run]);

  const formik = useFormik({
    initialValues: {
      name: "",
      run: "",
      nombre: "",
      id: "",
      dcto: 0,
      cuid: "",
      weight: "",
      originalWeight: "",
    },
  });

  const { values } = formik;

  return (
    <>
      <FlatList
        // other FlatList props
        keyboardShouldPersistTaps="always"
        data={[]}
        ListFooterComponent={
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
                onPress={() => setMostrarLecturaNFC(true)}
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
            <FormularioPesaje formik={formik} bandejas={bandejas} />
            {/* <NfcScan /> */}
          </>
        }
      />
      {mostrarLecturaNFC && (
        <LecturaNFC
          mostrarLecturaNFC={mostrarLecturaNFC}
          setMostrarLecturaNFC={setMostrarLecturaNFC}
          formik={formik}
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
