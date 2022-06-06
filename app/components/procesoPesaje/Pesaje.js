import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, FlatList } from "react-native";
import { readData } from "../../utilidades/variablesGlobales";
import { request, PERMISSIONS } from "react-native-permissions";
import { Icon, Button, Text, Divider } from "react-native-elements";
import { Title } from "react-native-paper";
import { useFormik } from "formik";
import FormularioTemporero from "./FormularioTemporero";
import firestore from "@react-native-firebase/firestore";
import FormularioPesaje from "./FormularioPesaje";
import LecturaNFC from "./nfc/LecturaNFC";
import ModalEnlace from "./ModalEnlace";
import { SnackBar } from "../../utilidades/Snackbar";
import RNBluetoothClassic from "react-native-bluetooth-classic";
import ConexionBalanza from "./ConexionBalanza";
import { validateRut, formatRut, RutFormat } from "@fdograph/rut-utilities";
import NfcManager from "react-native-nfc-manager";

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
  const [loadingTCosecha, setLoadingTCosecha] = useState(false);

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
            if (doc.data().rut !== user.rut) {
              bandejas.push(doc.data());
            }
          });
          setBandejas(bandejas);
        });
    }
    return () => {
      componentMounted.current = false;
    };
  }, [user.uid, user.cuid, user.rol, user.rut]);

  useEffect(() => {
    if (componentMounted.current) {
      const cuid = user.rol === "company" ? user.uid : user.cuid;
      firestore()
        .collection("usuarios")
        .where("cuid", "==", cuid)
        .onSnapshot((querySnapshot) => {
          let temporeros = [];
          querySnapshot.forEach((doc) => {
            if (
              doc.data().rut !== user.rut &&
              doc.data().rol === "harvester" &&
              doc.data().habilitado === true
            ) {
              temporeros.push(doc.data());
            }
          });
          setTemporeros(temporeros);
        });
    }
    return () => {
      componentMounted.current = false;
    };
  }, [user.uid, user.cuid, user.rol, user.rut]);

  const disponible = async () => {
    try {
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
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
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
  }, [RNBluetoothClassic.onStateChanged]);

  useEffect(() => {
    disponible();
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
      nombreTemporero: "",
      rut: "",
      nombre: "",
      id: "",
      dcto: 0,
      cuid: "2TtPZcIEcnQLeLbiXmDf646QJcx1",
      peso: "",
      pesoOriginal: "",
      bluetooth: false,
    },
  });

  const { values } = formik;

  const obtenerRegistros = (categoriaSelected) => {
    const peso = isNaN(parseFloat(values.peso)) ? 0 : parseFloat(values.peso);
    const vacio = {
      acumulado: peso,
      nombreTemporero: values.nombreTemporero.split(" ", 2)[0],
      apellidoTemporero: values.nombreTemporero.split(" ", 2)[1],
      idRegistro: values.rut,
      ultimoRegistro: new Date(),
    };
    if (categoriaSelected.item.registros.length > 0) {
      //cambiar mi rut
      const registro = categoriaSelected.item.registros.find(
        (registros) => registros.idRegistro === values.rut
      );
      if (registro) {
        console.log(registro.acumulado, "esto está acumulado");
        const nuevoRegistro = {
          acumulado: registro.acumulado + peso,
          nombreTemporero: values.nombreTemporero.split(" ", 2)[0],
          apellidoTemporero: values.nombreTemporero.split(" ", 2)[1],
          idRegistro: values.rut,
          ultimoRegistro: new Date(),
        };
        const index = categoriaSelected.item.registros.indexOf(registro);
        categoriaSelected.item.registros[index].acumulado =
          registro.acumulado + peso;

        return nuevoRegistro;
      } else {
        categoriaSelected.item.registros.push(vacio);
        return vacio;
      }
    } else {
      categoriaSelected.item.registros.push(vacio);
      return vacio;
    }
  };

  const validacionUsuario = () => {
    const isTemporero = temporeros.find(
      (temporero) =>
        temporero.rut === formatRut(values.rut, RutFormat.DOTS_DASH)
    );
    if (isTemporero !== undefined) return true;
    return false;
  };

  const guardar = async () => {
    setLoading(true);
    if (
      values.nombreTemporero !== "" &&
      values.rut !== "" &&
      values.peso !== ""
    ) {
      if (!validateRut(values.rut) || errorPeso) {
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
            .collection(
              "categoria/" + categoriaSelected.item.idCategoria + "/registros"
            )
            .doc(values.rut)
            .set(registro);

          const data = {
            idCategoria: categoriaSelected.item.idCategoria,
            fecha: new Date(),
            pesoOriginal: values.pesoOriginal,
            peso: values.peso,
            bluetooth: values.bluetooth,
          };
          await firestore()
            .collection(
              "categoria/" +
                categoriaSelected.item.idCategoria +
                "/registros/" +
                values.rut +
                "/registrosTemporero"
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

  const lecturaNFC = async () => {
    const NFCSupported = await NfcManager.isSupported();
    if (NFCSupported) {
      setMostrarLecturaNFC(true);
    } else {
      setMessage("El dispositivo no soporta NFC.");
      setOpenSnackbar(true);
    }
  };

  const terminarCosecha = async () => {
    setLoadingTCosecha(true);
    const categoria = {
      cuid: categoriaSelected.item.cuid,
      fechaInicio: new Date(
        categoriaSelected.item.fechaInicio.seconds * 1000 +
          categoriaSelected.item.fechaInicio.nanoseconds / 1000000
      ),
      fechaTermino: new Date(),
      idCategoria: categoriaSelected.item.idCategoria,
      nombreCategoria: categoriaSelected.item.nombreCategoria,
    };

    await firestore()
      .collection("categoria")
      .doc(categoriaSelected.item.idCategoria)
      .set(categoria);
    setLoadingTCosecha(false);
    setMessage("Cosecha: " + categoria.nombreCategoria + " terminada.");
    setOpenSnackbar(true);
  };
  return (
    <>
      <FlatList
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
              <Title style={{ fontSize: 18 }}>Información del Empleado</Title>
            </Divider>
            <View style={styles.containerButtons}>
              <Button
                onPress={() => lecturaNFC()}
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
              <Title style={{ fontSize: 18 }}>Información del Pesaje</Title>
            </Divider>
            <FormularioPesaje
              formik={formik}
              bandejas={bandejas}
              errorPeso={errorPeso}
              setErrorPeso={setErrorPeso}
            />
            <ConexionBalanza
              permiso={permiso}
              setOpenSnackbar={setOpenSnackbar}
              setMessage={setMessage}
              formik={formik}
              valores={values}
            />
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
            {user.rol !== "planner" &&
              categoriaSelected?.item?.fechaTermino === "" && (
                <View style={styles.wrapper}>
                  <Button
                    mode="contained"
                    color="blue"
                    icon={
                      <Icon
                        type="material-community"
                        name="calendar-check"
                        size={20}
                        color="white"
                      />
                    }
                    title="  Finalizar Cosecha"
                    loading={loadingTCosecha}
                    onPress={() => (loadingTCosecha ? null : terminarCosecha())}
                  ></Button>
                </View>
              )}
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
    marginTop: 10,
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
  wrapper: {
    width: Dimensions.get("window").width,
  },
});
