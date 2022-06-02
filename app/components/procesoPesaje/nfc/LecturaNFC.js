import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { BottomSheet, Text } from "react-native-elements";
import { Button } from "react-native-paper";
import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";
import { Buffer } from "buffer";
import { validateYupSchema } from "formik";
import { SnackBar } from "../../../utilidades/Snackbar";
export default function LecturaNFC(props) {
  const {
    mostrarLecturaNFC,
    setMostrarLecturaNFC,
    formik,
    setOpenSnackbar,
    setMessage,
  } = props;
  const componentMounted = useRef(true);
  const [isScanned, setIsScanned] = useState(false);
  const [error, setError] = useState(false);
  const { values } = formik;

  useEffect(() => {
    readNdef();
    () => NfcManager.cancelTechnologyRequest();
  }, [isScanned]);

  const readNdef = async () => {
    try {
      const supported = await NfcManager.isSupported();
      const nfcScanning = await NfcManager.isEnabled();
      // register for the NFC tag with NDEF in it
      if (supported && nfcScanning) {
        await NfcManager.start();
        let tag = null;
        await NfcManager.requestTechnology(NfcTech.Ndef);
        // the resolved tag object will contain `ndefMessage` property
        tag = await NfcManager.getTag();
        if (tag !== null) {
          console.log(tag, "esto es el tag");
          console.log(Ndef.text.decodePayload(tag.ndefMessage[0].payload));
          console.log(Ndef.text.decodePayload(tag.ndefMessage[1].payload));
          values.nombreTemporero = Ndef.text.decodePayload(
            tag.ndefMessage[1].payload
          );
          values.rut = Ndef.text.decodePayload(tag.ndefMessage[0].payload);
        }
        NfcManager.cancelTechnologyRequest();
        setError(false);
        setIsScanned(true);
        setTimeout(() => {
          setMostrarLecturaNFC(false);
        }, 500);
      }
    } catch (ex) {
      NfcManager.cancelTechnologyRequest();
      setIsScanned(false);
      // setMessage("Ha ocurrido un error al leer la tarjeta");
      // setOpenSnackbar(true);
      setError(true);
      console.log("Oops!", ex);
    }
  };

  const cerrar = () => {
    try {
      NfcManager.cancelTechnologyRequest();
    } catch (error) {
      console.log(error);
    }
    setMostrarLecturaNFC(false);
  };

  return (
    <View style={styles.wrapper}>
      <BottomSheet
        isVisible={mostrarLecturaNFC}
        //containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
      >
        <View
          style={{
            backgroundColor: "white",
            height: Dimensions.get("window").height * 0.5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text h3 style={{ marginBottom: 20 }}>
            Listo Para Escanear
          </Text>
          <View>
            <Image
              style={{ width: 220, height: 230, marginTop: 10 }}
              source={
                isScanned === true
                  ? require("../../../../assets/imagenes/checked.png")
                  : require("../../../../assets/imagenes/scanner.png")
              }
            />
          </View>
          <Text h4 h4Style={{ fontSize: 16 }} style={{ marginTop: 30 }}>
            Por favor acerque el teléfono a la tarjeta NFC
          </Text>
          {error && (
            <Text h4 h4Style={{ fontSize: 16 }} style={{ color: "red" }}>
              Ha ocurrido un error
            </Text>
          )}
        </View>
        <Button mode="contained" color="blue" onPress={() => cerrar()}>
          Cancelar
        </Button>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
