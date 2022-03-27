import React, { useState, useEffect, useRef } from "react";
import {
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  PermissionsAndroid,
  ActivityIndicator,
  Text,
} from "react-native";
import { SnackBar } from "../utilidades/Snackbar";

import { Header as HeaderRNE, Icon, ListItem } from "react-native-elements";
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

export default function EdicionContrato() {
  const [plantilla, setPlantilla] = useState("");
  const [datosEmpresa, setDatosEmpresa] = useState("");
  const [datosEmpleado, setDatosEmpleado] = useState("");
  const [datosServicio, setDatosServicio] = useState("");
  const [datosAnexos, setDatosAnexos] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [wordDocument, setWordDocument] = useState("");
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const keyboard = useKeyboard();
  const navigation = useNavigation();

  const componentMounted = useRef(true);
  const STORAGE_KEY = "@plantillaSelect";
  const [html, setHtml] = useState("");
  const richText = useRef();

  const list = [
    {
      title: "Guardar",
      icon: "save",
    },
    {
      title: "Compartir",
      icon: "share",
    },
  ];
  useEffect(() => {
    Promise.all([
      readData(STORAGE_KEY),
      readData("@datosEmpresa"),
      readData("@datosEmpleado"),
      readData("@datosServicio"),
      readData("@datosAnexos"),
    ]).then(async (values) => {
      setPlantilla(values[0]);
      setDatosEmpresa(values[1]);
      setDatosEmpleado(values[2]);
      setDatosServicio(values[3]);
      setDatosAnexos(values[4]);
      guardar(values[0], values[1], values[2], values[3], values[4]);
    });
  }, []);

  const docVars = (datosEmpresa, datosEmpleado, datosServicio, datosAnexos) => {
    return {
      direccionEmpresa: datosEmpresa.direccion,
      dia: "",
      mes: "",
      anio: "",
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

  const guardar = async (
    plantilla,
    datosEmpresa,
    datosEmpleado,
    datosServicio,
    datosAnexos
  ) => {
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
    // const a = Buffer.from(new Uint8Array(buf));
    // let asd = Buffer.from(a).toString("base64");
    // console.log(asd);
    // let documenturi =
    //   FileSystem.documentDirectory + `${encodeURI("documento")}.docx`;
    // await FileSystem.writeAsStringAsync(documenturi, asd, {
    //   encoding: FileSystem.EncodingType.Base64,
    // });
    // await Sharing.shareAsync(documenturi);
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Solicitud de Permiso",
          message: "Es necesario para poder guardar el archivo",
          buttonNeutral: "Pregúntame más tarde",
          buttonNegative: "Cancelar",
          buttonPositive: "Ok",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.warn(err);
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
    let documenturi =
      FileSystem.documentDirectory +
      `${encodeURI(datosEmpleado.nombreEmpleado)}.docx`;
    const a = await FileSystem.writeAsStringAsync(documenturi, documento, {
      encoding: FileSystem.EncodingType.Base64,
    });
    let { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      const uri = await MediaLibrary.createAssetAsync(documenturi);
      setFileName(uri.filename);
      setOpen(true);
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

  const exportar = (tipo) => {
    if (tipo === "Guardar") {
      guardarLocal();
    } else {
      compartir();
    }
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

        {html === "" && (
          <View style={styles.loaderPlantilla}>
            <ActivityIndicator color="blue" size="large" />
            <Text>Generando Contrato</Text>
          </View>
        )}

        <View style={{ height: "90%" }}>
          <TouchableOpacity onPress={() => setMostrar(false)}>
            <ScrollView>
              <KeyboardAvoidingView>
                <RichEditor
                  ref={richText}
                  initialContentHTML={html}
                  disabled={true}
                />
              </KeyboardAvoidingView>
            </ScrollView>
          </TouchableOpacity>
        </View>
        {open && (
          <SnackBar
            open={open}
            setOpen={setOpen}
            message={fileName + " guardado en el almacenamiento interno /DCIM/"}
          />
        )}
        {mostrar && (
          <View style={[styles.overlaycontainer, { height: 40 }]}>
            {list.map((item, i) => (
              <ListItem
                key={i}
                bottomDivider
                containerStyle={styles.listItem}
                button
                onPress={() => {
                  exportar(item.title);
                }}
              >
                <Icon name={item.icon} />
                <ListItem.Title>{item.title}</ListItem.Title>
              </ListItem>
            ))}
          </View>
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

    marginTop: "15%",
  },
  listItem: {
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "lightgrey",
    height: 80,
  },
  loaderPlantilla: { marginTop: 10, marginBottom: 10, alignItems: "center" },
});
