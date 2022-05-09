import React, { useState, useEffect, useRef } from "react";
import {
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
} from "react-native";
import { Menu } from "react-native-paper";
import { SnackBar } from "../utilidades/Snackbar";
import { storeData } from "../utilidades/variablesGlobales";
import { Header as HeaderRNE, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { readData } from "../utilidades/variablesGlobales";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Buffer } from "buffer";
import { convertToHtml } from "mammoth/mammoth.browser";
import { RichEditor } from "react-native-pell-rich-editor";
import { useKeyboard } from "@react-native-community/hooks";
import * as IntentLauncher from "expo-intent-launcher";
import RNFetchBlob from "rn-fetch-blob";

export default function EdicionContrato() {
  const [plantilla, setPlantilla] = useState("");
  const [datosEmpresa, setDatosEmpresa] = useState("");
  const [datosEmpleado, setDatosEmpleado] = useState("");
  const [datosServicio, setDatosServicio] = useState("");
  const [datosAnexos, setDatosAnexos] = useState("");
  const [contratosCreados, setContratosCreados] = useState([]);
  const [mostrar, setMostrar] = useState(false);
  const [wordDocument, setWordDocument] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const keyboard = useKeyboard();
  const navigation = useNavigation();

  const STORAGE_KEY = "@plantillaSelect";
  const CONTRATOS_KEY = "@contratosCreados";
  const [html, setHtml] = useState("");
  const richText = useRef();

  useEffect(() => {
    Promise.all([
      readData(STORAGE_KEY),
      readData("@datosEmpresa"),
      readData("@datosEmpleado"),
      readData("@datosServicio"),
      readData("@datosAnexos"),
      readData(CONTRATOS_KEY),
    ]).then(async (values) => {
      setPlantilla(values[0]);
      setDatosEmpresa(values[1]);
      setDatosEmpleado(values[2]);
      setDatosServicio(values[3]);
      setDatosAnexos(values[4]);
      values[5] === null ? null : setContratosCreados(values[5]);
      guardar(values[0], values[1], values[2], values[3], values[4], values[5]);
    });
  }, [html]);

  const obtenerMes = (mes) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return meses[months.indexOf(mes)];
  };

  const docVars = (datosEmpresa, datosEmpleado, datosServicio, datosAnexos) => {
    return {
      direccionEmpresa: datosEmpresa.direccion,
      dia: new Date().toUTCString().split(" ", 4)[1],
      mes: obtenerMes(new Date().toUTCString().split(" ", 4)[2]),
      anio: new Date().toUTCString().split(" ", 4)[3],
      razonSocial: datosEmpresa.razonSocial,
      rutRazonSocial: datosEmpresa.rutRazonSocial,
      representante: datosEmpresa.representante,
      cargoRepresentante: datosEmpresa.cargoRepresentante,
      rutRepresentante: datosEmpresa.rutRepresentante,
      direccionRepresentante: datosEmpresa.direccion,
      ciudadRepresentante: datosEmpresa.ciudad,
      nombreEmpleado: datosEmpleado.nombreEmpleado,
      nacionalidad: datosEmpleado.nacionalidad,
      fechaNacimiento: datosEmpleado.fechaNacimiento,
      numeroDocumentoEmpleado: datosEmpleado.numeroDocumento,
      rutEmpleado: datosEmpleado.rut,
      profesionOficio: datosEmpleado.profesionOficio,
      estadoCivil: datosEmpleado.estadoCivil,
      direccionEmpleado: datosEmpleado.direccion,
      nombreServicio: datosServicio.nombreServicio,
      ubicacion: datosServicio.ubicacion,
      faenas: datosServicio.faenas,
      temporada: datosServicio.temporada,
      horasJornada: datosServicio.horasJornada,
      distribucionHoras: datosServicio.distribucionHoras,
      sueldo: datosServicio.sueldo,
      labor: datosServicio.labor,
      beneficios: datosAnexos.beneficios,
      regimenAntiguo:
        datosAnexos.regimenPension === "Regimen Nuevo A.F.P" ? "..." : "X",
      fonasa: datosAnexos.regimenSalud === "Fonasa" ? "X" : "...",
      regimenNuevo:
        datosAnexos.regimenPension === "Regimen Nuevo A.F.P" ? "X" : "...",
      isapre: datosAnexos.regimenSalud === "Fonasa" ? "..." : "X",
      fechaInicioFaenas: datosAnexos.fechaInicioFaenas,
      cantidadEjemplares: datosAnexos.cantidadEjemplares,
    };
  };

  const eliminarContrato = (contratos, plantilla) => {
    setMessage("El archivo no se ha Encontrado");
    setOpen(true);
    const contratoFiltrado = contratos.filter(
      (contrato) => contrato.id !== plantilla.item.id
    );

    storeData(contratoFiltrado, CONTRATOS_KEY);

    setTimeout(() => {
      Promise.resolve(navigation.navigate("Contratos"));
    }, 2000);
  };

  const guardar = async (
    plantilla,
    datosEmpresa,
    datosEmpleado,
    datosServicio,
    datosAnexos,
    contratos
  ) => {
    const fileInfo = await FileSystem.getInfoAsync(plantilla.item.uri);
    if (!fileInfo.exists) {
      eliminarContrato(contratos, plantilla);
    } else {
      let content = await FileSystem.readAsStringAsync(plantilla.item.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      let document = Buffer.from(content, "base64");

      const zip = new PizZip(document);

      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      doc.render({
        ...docVars(datosEmpresa, datosEmpleado, datosServicio, datosAnexos),
      });
      setWordDocument(doc);
      const buf = doc.getZip().generate({
        type: "arrayBuffer",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const htmlResult = await convertToHtml({ arrayBuffer: buf });

      setHtml(htmlResult.value);
    }
  };

  const guardarLocal = async () => {
    const buf = wordDocument.getZip().generate({
      type: "arrayBuffer",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const buffer = Buffer.from(new Uint8Array(buf));
    let documento = Buffer.from(buffer).toString("base64");
    console.log(plantilla.item);
    // const folder = await FileSystem.getInfoAsync(
    //   FileSystem.documentDirectory + "Contratos/"
    // );

    // // Check if folder does not exist, create one furthermore
    // if (!folder.exists) {
    //   await FileSystem.makeDirectoryAsync(
    //     FileSystem.documentDirectory + "Contratos/"
    //   );
    // }
    let documenturi =
      FileSystem.documentDirectory +
      datosEmpleado.nombreEmpleado +
      "-" +
      datosEmpleado.rut +
      ".docx";

    // const ans = await FileSystem.getInfoAsync(documenturi);
    // console.log(ans, "esto es ans");
    // FileSystem.getContentUriAsync(ans.uri).then((cUri) => {
    //   //Open save image options
    //   IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
    //     data: cUri,
    //     flags: 1,
    //   });
    // });
    let { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      try {
        console.log(RNFetchBlob.fs.dirs.DownloadDir);
        const a = await FileSystem.writeAsStringAsync(documenturi, documento, {
          encoding: FileSystem.EncodingType.Base64,
        });
        RNFetchBlob.fs
          .mv(
            documenturi.replace("file://", ""),
            RNFetchBlob.fs.dirs.DownloadDir +
              "/" +
              datosEmpleado.nombreEmpleado +
              "-" +
              datosEmpleado.rut +
              ".docx"
          )
          .then(() => {
            const uri = {
              uri:
                "file://" +
                RNFetchBlob.fs.dirs.DownloadDir +
                "/" +
                datosEmpleado.nombreEmpleado +
                "-" +
                datosEmpleado.rut +
                ".docx",
              fileName:
                datosEmpleado.nombreEmpleado +
                "-" +
                datosEmpleado.rut +
                ".docx",
            };

            setContratosCreados((contratos) => [...contratos, uri]);
            storeData([...contratosCreados, uri], CONTRATOS_KEY);
            Promise.resolve(readData(CONTRATOS_KEY)).then((data) =>
              data === null ? null : setContratosCreados(data)
            );
            setFileName(
              datosEmpleado.nombreEmpleado + "-" + datosEmpleado.rut + ".docx"
            );
            setMessage(
              datosEmpleado.nombreEmpleado +
                "-" +
                datosEmpleado.rut +
                ".docx" +
                " guardado en la carpeta de descargas"
            );
            setOpen(true);
            setTimeout(() => {
              Promise.resolve(navigation.navigate("Contratos"));
            }, 3000);
          });
        // const uri = await MediaLibrary.createAssetAsync(ans.uri);
        // const album = await MediaLibrary.getAlbumAsync("Contratos");
        // if (album === null) {
        //   await MediaLibrary.createAlbumAsync("Contratos", uri, false);
        // } else {
        //   await MediaLibrary.addAssetsToAlbumAsync([uri], album, false);
        // }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const compartir = async () => {
    const buf = wordDocument.getZip().generate({
      type: "arrayBuffer",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const buffer = Buffer.from(new Uint8Array(buf));
    let documento = Buffer.from(buffer).toString("base64");
    let documenturi =
      FileSystem.documentDirectory +
      `${encodeURI(datosEmpleado.nombreEmpleado)}.docx`;
    await FileSystem.writeAsStringAsync(documenturi, documento, {
      encoding: FileSystem.EncodingType.Base64,
    });
    await Sharing.shareAsync(documenturi);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View>
          <HeaderRNE
            backgroundColor="#2f3bc7"
            leftComponent={{
              icon: "arrow-back",
              color: "#fff",
              style: styles.backButton,
              onPress: () => navigation.navigate("TabProcesoContrato"),
            }}
            rightComponent={
              <View>
                <TouchableOpacity
                  onPress={() => setMostrar((mostrar) => !mostrar)}
                >
                  <Icon name="more-vert" color="white" size={28} />
                </TouchableOpacity>
              </View>
            }
            centerComponent={{
              text: "Visualización Contrato",
              style: styles.heading,
            }}
          />
        </View>

        {html === "" ? (
          <>
            <View style={styles.loaderPlantilla}>
              <ActivityIndicator color="blue" size="large" />
              <Text>Generando Contrato</Text>
            </View>
            {open && (
              <SnackBar open={open} setOpen={setOpen} message={message} />
            )}
          </>
        ) : (
          <>
            <View style={{ height: "90%" }}>
              <TouchableOpacity onPress={() => setMostrar(false)}>
                <ScrollView>
                  <KeyboardAvoidingView>
                    <RichEditor
                      ref={richText}
                      initialContentHTML={html === "" ? "" : html}
                      disabled={true}
                    />
                  </KeyboardAvoidingView>
                </ScrollView>
              </TouchableOpacity>
            </View>
            {open && (
              <SnackBar open={open} setOpen={setOpen} message={message} />
            )}
            {mostrar && (
              <View style={[styles.overlaycontainer, { height: 70 }]}>
                <Menu.Item
                  icon="content-save"
                  onPress={() => {
                    guardarLocal();
                  }}
                  title="Guardar"
                />
                <Menu.Item
                  icon="share-variant"
                  onPress={() => {
                    compartir();
                  }}
                  title="Compartir"
                />
              </View>
            )}
          </>
        )}
      </View>
      {/* <View style={{ height: "90%" }}>
        <ScrollView>
          <KeyboardAvoidingView>
            <RichEditor
              ref={richText}
              initialContentHTML={html}
              disabled={true}
              onChange={(texto) => console.log(texto, "texto")}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </View> */}
      {/* <KeyboardAvoidingView
        style={keyboard.keyboardShown && { flex: 1, margin: 7 }}
      >
        <RichToolbar
          style={{ marginBottom: 30 }}
          editor={richText}
          actions={["share", "save"]}
          iconMap={{
            //share-variant
            share: Share,
            save: Save,
          }}
          share={() => compartir()}
          save={() => compartir()}
        />
      </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  boton: {
    backgroundColor: "white",
  },
  backButton: {
    marginRight: "1px",
  },
  heading: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  overlaycontainer: {
    flex: 1,
    position: "absolute",
    right: "5%",
    top: 0,
    opacity: 1,
    backgroundColor: "white",
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "lightgrey",
    marginTop: "15%",
  },
  listItem: {
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "lightgrey",
    height: 80,
  },
  loaderPlantilla: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    height: "85%",
  },
});
