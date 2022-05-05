import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  PermissionsAndroid,
} from "react-native";
import { readData } from "../../utilidades/variablesGlobales";
import { request, PERMISSIONS } from "react-native-permissions";
import { Icon, Button, Text, Divider } from "react-native-elements";
import { Title } from "react-native-paper";
import { useFormik } from "formik";
import Autocomplete from "react-native-autocomplete-input";
import FormularioTemporero from "./FormularioTemporero";
import NfcScan from "./nfc/NfcScan";
import firestore from "@react-native-firebase/firestore";
import { db } from "../../api/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import FormularioPesaje from "./FormularioPesaje";
import LecturaNFC from "./nfc/LecturaNFC";
import ModalEnlace from "./ModalEnlace";
import { SnackBar } from "../../utilidades/Snackbar";
import { BleManager } from "react-native-ble-plx";
import RNBluetoothClassic from "react-native-bluetooth-classic";
import ConexionBalanza from "./ConexionBalanza";
import { validateRut, formatRut, RutFormat } from "@fdograph/rut-utilities";

export default function Pesaje(props) {
  const { index, setIndex, user } = props;
  const [categoriaSelected, setCategoriaSelected] = useState("");
  const componentMounted = useRef(true);
  const [bandejas, setBandejas] = useState([]);
  const [temporeros, setTemporeros] = useState([]);
  const [mostrarLecturaNFC, setMostrarLecturaNFC] = useState(false);
  const [mostrarEnlaceNFC, setMostrarEnlaceNFC] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [permiso, setPermiso] = useState(false);
  const [errorPeso, setErrorPeso] = useState(false);
  const [loading, setLoading] = useState(false);
  const [device, setDevice] = useState(null);
  const manager = new BleManager();

  const STORAGE_KEY = "@categoriaSelect";

  useEffect(() => {
    Promise.resolve(readData(STORAGE_KEY)).then((data) =>
      data === null ? null : setCategoriaSelected(data)
    );
  }, [index]);

  useEffect(() => {
    if (componentMounted.current) {
      const cuid = user.rol === "company" ? user.uid : user.cuid;
      firestore()
        .collection("bandeja")
        .where("cuid", "==", cuid)
        .onSnapshot((querySnapshot) => {
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

  useEffect(() => {
    if (componentMounted.current) {
      const cuid = user.rol === "company" ? user.uid : user.cuid;
      firestore()
        .collection("users")
        .where("cuid", "==", cuid)
        .onSnapshot((querySnapshot) => {
          let temporeros = [];
          querySnapshot.forEach((doc) => {
            if (
              doc.data().run !== user.run &&
              doc.data().rol === "harvester" &&
              doc.data().isenabled === true
            ) {
              temporeros.push(doc.data());
            }
          });
          console.log(temporeros, "estos son los temporeros");
          setTemporeros(temporeros);
        });
    }
    return () => {
      componentMounted.current = false;
    };
  }, [user.uid, user.cuid, user.rol, user.run]);

  const disponible = async () => {
    try {
      request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT).then(async (result) => {
        if (result === "granted") {
          if (await RNBluetoothClassic.isBluetoothAvailable()) {
            const enabled = await RNBluetoothClassic.isBluetoothEnabled();

            if (enabled) {
              setPermiso(true);
            } else {
              setPermiso(false);
              setMessage(
                "Por Favor Active el Bluetooth Para Recibir los Datos de la Balanza"
              );
              setOpenSnackbar(true);
            }
          } else {
            setPermiso(false);
            setMessage("El dispositivo no es compatible con Bluetooth.");
            setOpenSnackbar(true);
          }
        } else {
          setPermiso(false);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (componentMounted.current) {
      RNBluetoothClassic.onStateChanged(async (state) => {
        if (state.enabled === true) {
          disponible();
        } else {
          setPermiso(false);
          setMessage(
            "Por Favor Active el Bluetooth Para Recibir los Datos de la Balanza"
          );
          setOpenSnackbar(true);
        }
      });
    }
    return () => {
      componentMounted.current = false;
    };
  }, []);

  useEffect(() => {
    disponible();
    // const hola = async () => {
    //   const e = await RNBluetoothClassic.getBondedDevices();
    //   console.log(e, "esto es e");
    // };
    // hola();
  }, []);

  // useEffect(() => {
  //   request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN)
  //     .then((result) => {
  //       if (result === "granted") {
  //         manager.startDeviceScan(null, null, (error, device) => {
  //           if (error) {
  //             console.log(error);
  //             // Handle error (scanning will be stopped automatically)
  //             return;
  //           }
  //           console.log("device.name: " + device.name);
  //           // Check if it is a device you are looking for based on advertisement data
  //           // or other criteria.
  //           if (
  //             device.name === "TI BLE Sensor Tag" ||
  //             device.name === "SensorTag"
  //           ) {
  //             // Stop scanning as it's not necessary if you are scanning for one device.
  //             manager.stopDeviceScan();
  //             // Proceed with connection.
  //           }
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       // …
  //     });
  // }, [manager]);

  const formik = useFormik({
    initialValues: {
      name: "",
      run: "",
      nombre: "bandeja 1.0 kg",
      id: "tk4lD384ZusDfSujkfv9",
      dcto: 1,
      cuid: "2TtPZcIEcnQLeLbiXmDf646QJcx1",
      weight: "",
      originalWeight: "",
    },
  });

  const { values } = formik;

  const obtenerRegistros = (categoriaSelected) => {
    const peso = isNaN(parseFloat(values.weight))
      ? 0
      : parseFloat(values.weight);
    const vacio = {
      acumulate: peso,
      firstName: values.name.split(" ", 2)[0],
      lastName: values.name.split(" ", 2)[1],
      id: values.run,
      lastDate: new Date(),
    };
    if (categoriaSelected.item.registers.length > 0) {
      //cambiar mi rut
      const registro = categoriaSelected.item.registers.find(
        (registers) => registers.id === values.run
      );
      if (registro) {
        console.log(registro.acumulate, "esto está acumulado");
        const nuevoRegistro = {
          acumulate: registro.acumulate + peso,
          firstName: values.name.split(" ", 2)[0],
          lastName: values.name.split(" ", 2)[1],
          id: values.run,
          lastDate: new Date(),
        };
        const index = categoriaSelected.item.registers.indexOf(registro);
        categoriaSelected.item.registers[index].acumulate =
          registro.acumulate + peso;

        return nuevoRegistro;
      } else {
        categoriaSelected.item.registers.push(vacio);
        return vacio;
      }
    } else {
      categoriaSelected.item.registers.push(vacio);
      return vacio;
    }
  };

  const validacionUsuario = () => {
    const isTemporero = temporeros.find(
      (temporero) =>
        temporero.run === formatRut(values.run, RutFormat.DOTS_DASH)
    );
    if (isTemporero !== undefined) return true;
    return false;
  };

  const guardar = async () => {
    setLoading(true);
    if (values.name !== "" && values.run !== "" && values.weight !== "") {
      if (!validateRut(values.run) || errorPeso) {
        if (errorPeso) {
          setMessage("Peso no válido");
        } else {
          setMessage("Rut no válido");
        }
        setLoading(false);
        setOpenSnackbar(true);
      } else {
        if (!validacionUsuario()) {
          setLoading(false);
          setMessage("Temporero no Registrado");
          setOpenSnackbar(true);
        } else {
          const registro = obtenerRegistros(categoriaSelected);

          await firestore()
            .collection("category/" + categoriaSelected.item.id + "/registers")
            .doc(values.run)
            .set(registro);

          const data = {
            category: categoriaSelected.item.id,
            date: new Date(),
            originalWeight: values.originalWeight,
            weight: values.weight,
          };
          await firestore()
            .collection(
              "category/" +
                categoriaSelected.item.id +
                "/registers/" +
                values.run +
                "/workerRegisters"
            )
            .add(data);

          setLoading(false);
          setMessage("Información Guardada");
          setOpenSnackbar(true);
        }
      }
    } else {
      setLoading(false);
      setMessage("Falta información por completar");
      setOpenSnackbar(true);
    }
  };

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
              {/* <Button
                onPress={() => setMostrarEnlaceNFC(true)}
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
              /> */}

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
            <FormularioPesaje
              formik={formik}
              bandejas={bandejas}
              errorPeso={errorPeso}
              setErrorPeso={setErrorPeso}
            />
            <ConexionBalanza permiso={permiso} />
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <Button
                onPress={() => (loading ? null : guardar())}
                buttonStyle={styles.boton}
                icon={
                  <Icon
                    type="material-community"
                    name="content-save"
                    size={20}
                    color="white"
                  />
                }
                titleStyle={{ fontSize: 14 }}
                title=" Guardar"
                loading={loading}
              />
            </View>
          </>
        }
      />
      {mostrarLecturaNFC && (
        <LecturaNFC
          mostrarLecturaNFC={mostrarLecturaNFC}
          setMostrarLecturaNFC={setMostrarLecturaNFC}
          formik={formik}
          setOpenSnackbar={setOpenSnackbar}
          setMessage={setMessage}
        />
      )}
      {mostrarEnlaceNFC && (
        <ModalEnlace
          open={mostrarEnlaceNFC}
          setOpen={setMostrarEnlaceNFC}
          user={user}
          temporeros={temporeros}
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
    maxHeight: "8%",
    marginTop: 20,
  },

  containerButtons: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    marginTop: 10,
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
