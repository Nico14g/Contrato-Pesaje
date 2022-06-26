import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, FlatList } from "react-native";
import { readData, storeData } from "../../utilidades/variablesGlobales";
import { Icon, Button, Text, Divider } from "react-native-elements";
import { Title } from "react-native-paper";
import { useFormik } from "formik";
import FormularioTemporero from "./FormularioTemporero";
import firestore, { firebase } from "@react-native-firebase/firestore";
import FormularioPesaje from "./FormularioPesaje";
import LecturaNFC from "./nfc/LecturaNFC";
import ModalEnlace from "./ModalEnlace";
import { SnackBar } from "../../utilidades/Snackbar";
import RNBluetoothClassic from "react-native-bluetooth-classic";
import ConexionBalanza from "./ConexionBalanza";
import { validateRut, formatRut, RutFormat } from "@fdograph/rut-utilities";
import NfcManager from "react-native-nfc-manager";
import * as Speech from "expo-speech";
import ModalCreacionTemporero from "./ModalCreacionTemporero";
import ModalCerrarCosecha from "./ModalCerrarCosecha";

export default function Pesaje(props) {
  const { index, user } = props;
  const [categoriaSelected, setCategoriaSelected] = useState("");
  const componentMounted = useRef(true);
  const [bandejas, setBandejas] = useState([]);
  const [temporeros, setTemporeros] = useState([]);
  const [mostrarLecturaNFC, setMostrarLecturaNFC] = useState(false);
  const [mostrarEnlaceNFC, setMostrarEnlaceNFC] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openCreacionTemporero, setOpenCreacionTemporero] = useState(false);
  const [openCerrarCosecha, setOpenCerrarCosecha] = useState(false);
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

  const obtenerRegistros = async (categoriaSelected) => {
    const peso = isNaN(parseFloat(values.peso)) ? 0 : parseFloat(values.peso);
    const vacio = {
      acumulado: peso,
      nombreTemporero: values.nombreTemporero.split(" ", 2)[0],
      apellidoTemporero: values.nombreTemporero.split(" ", 2)[1],
      idRegistro: values.rut,
      ultimoRegistro: new Date(),
    };

    if (categoriaSelected.item.registros.length > 0) {
      const registro = categoriaSelected.item.registros.find(
        (registros) => registros.idRegistro === values.rut
      );
      if (registro) {
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

        await storeData(categoriaSelected, "@categoriaSelect");
        return nuevoRegistro;
      } else {
        categoriaSelected.item.registros.push(vacio);
        await storeData(categoriaSelected, "@categoriaSelect");
        return vacio;
      }
    } else {
      categoriaSelected.item.registros.push(vacio);
      await storeData(categoriaSelected, "@categoriaSelect");
      return vacio;
    }
  };

  function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
  }

  const obtenerAcumuladoDia = (registrosTemporero) => {
    let acumulado = 0;

    registrosTemporero.map((registro) => {
      const fecha = registro.fecha.toDate();
      if (
        fecha.getFullYear() === new Date().getFullYear() &&
        fecha.getMonth() === new Date().getMonth() &&
        fecha.getDate() === new Date().getDate()
      ) {
        acumulado = acumulado + registro.peso;
      }
    });
    return acumulado;
  };

  const escuchar = async (registro, data) => {
    let registrosTemporero = [];

    let registers = await firestore()
      .collection(
        "categoria/" +
          categoriaSelected.item.idCategoria +
          "/registros/" +
          values.rut +
          "/registrosTemporero"
      )
      .get();
    registers.forEach((documentSnapshot) =>
      registrosTemporero.push(documentSnapshot.data())
    );

    // await firestore()
    //   .collection(
    //     "categoria/" +
    //       categoriaSelected.item.idCategoria +
    //       "/registros/" +
    //       values.rut +
    //       "/registrosTemporero"
    //   )
    //   .get()
    //   .then((querySnapshot) => {
    //     querySnapshot.forEach((documentSnapshot) => {
    //       registrosTemporero.push(documentSnapshot.data());
    //     });
    //   });

    const encontrado = registrosTemporero.find(
      (registro) => registro.fecha.toDate().toString() === data.fecha.toString()
    );

    if (encontrado === undefined) {
      data.fecha = firestore.Timestamp.fromDate(data.fecha);
      registrosTemporero.push(data);
    }
    const acumuladoDia = obtenerAcumuladoDia(registrosTemporero);

    const texto =
      values.nombreTemporero +
      ", Hoy ha acumulado " +
      roundToTwo(acumuladoDia) +
      " kilogramos, y en total a pesado " +
      roundToTwo(registro.acumulado) +
      " kilogramos";
    Speech.stop();
    Speech.speak(texto);
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
      values.peso !== "" &&
      parseFloat(values.peso) > 0 &&
      categoriaSelected.item.fechaTermino === ""
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
          setOpenCreacionTemporero(true);
        } else {
          const registro = await obtenerRegistros(categoriaSelected);

          firestore()
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
          firestore()
            .collection(
              "categoria/" +
                categoriaSelected.item.idCategoria +
                "/registros/" +
                values.rut +
                "/registrosTemporero"
            )
            .add(data);

          await escuchar(registro, data);
          setMessage("Información Guardada");
          setOpenSnackbar(true);
          setLoading(false);
        }
      }
    } else {
      if (parseFloat(values.peso) <= 0) {
        setMessage("Peso negativo o 0");
      } else {
        if (categoriaSelected.item.fechaTermino !== "") {
          setMessage("La cosecha ya ha terminado");
        } else {
          setMessage("Falta información por completar");
        }
      }
      setLoading(false);

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
                    onPress={() =>
                      loadingTCosecha ? null : setOpenCerrarCosecha(true)
                    }
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
      {openCreacionTemporero && (
        <ModalCreacionTemporero
          open={openCreacionTemporero}
          setOpen={setOpenCreacionTemporero}
          nombreTemporero={values.nombreTemporero}
          rutTemporero={values.rut}
          setOpenSnackbar={setOpenSnackbar}
          setMessage={setMessage}
          user={user}
        />
      )}
      {openCerrarCosecha && (
        <ModalCerrarCosecha
          open={openCerrarCosecha}
          setOpen={setOpenCerrarCosecha}
          categoriaSelected={categoriaSelected}
          setLoadingTCosecha={setLoadingTCosecha}
          setOpenSnackbar={setOpenSnackbar}
          setMessage={setMessage}
          user={user}
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
