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
import NfcManager, { Ndef, NfcTech, NfcA } from "react-native-nfc-manager";
import { SnackBar } from "../../../utilidades/Snackbar";

export default function EscrituraNFC(props) {
  const {
    mostrarEscrituraNFC,
    setMostrarEscrituraNFC,
    selectedTemporero,
    setOpenSnackbar,
    setMessage,
  } = props;
  const componentMounted = useRef(true);
  const [isScanned, setIsScanned] = useState(false);
  const [error, setError] = useState(false);
  const techs = ["Ndef", "NfcA", "MifareClassic", "NdefFormatable"];
  useEffect(() => {
    writeNdef();
    () => NfcManager.cancelTechnologyRequest();
  }, [isScanned]);

  const escribirNdef = async (bytes) => {
    //await NfcManager.requestTechnology(NfcTech.Ndef);
    const e = await NfcManager.ndefHandler.writeNdefMessage(bytes);
    return true;
  };

  const convertStringToByteArray = (str) => {
    function encodeHex(str) {
      var bytes = [];
      for (var i = 0; i < str.length; ++i) {
        bytes.push(str.charCodeAt(i));
      }
      return bytes;
    }

    var byteArray = encodeHex(str);
    return byteArray;
  };

  const escribirNfcA = async (bytes) => {
    //await NfcManager.requestTechnology(NfcTech.NfcA);
    const name = selectedTemporero.firstName + " " + selectedTemporero.lastName;
    console.log(selectedTemporero);
    setTimeout(async () => {
      const e = await NfcManager.nfcAHandler.transceive(
        convertStringToByteArray(name)
      );
    }, 2000);

    //console.log("resultado", e);
    return true;
  };
  const writeNdef = async () => {
    let result = false;

    try {
      // STEP 1

      const supported = await NfcManager.isSupported();
      const nfcScanning = await NfcManager.isEnabled();

      if (supported && nfcScanning) {
        await NfcManager.requestTechnology([]);
        let tag = null;
        tag = await NfcManager.getTag();
        if (tag !== null) {
          let tech = undefined;
          for (let i = 0; i < tag.techTypes.length; i++) {
            tech = techs.find(
              (tech) => tech === tag.techTypes[i].split(".", 4)[3]
            );
            if (tech !== undefined) {
              i = tag.techTypes.length;
            }
          }
          if (tech !== undefined) {
            const bytes = Ndef.encodeMessage([
              Ndef.textRecord(selectedTemporero.name),
              Ndef.textRecord(selectedTemporero.run),
            ]);
            console.log(bytes);
            if (bytes) {
              if (tech === "Ndef") result = escribirNdef();
              if (tech === "NfcA") result = escribirNfcA();
            }
          }
        }

        NfcManager.cancelTechnologyRequest();
        setIsScanned(true);
        setTimeout(() => {
          setMostrarEscrituraNFC(false);
        }, 500);
      } else {
        if (!supported) {
          setMessage("NFC No Soportado");
        } else {
          setMessage("Primero Active el NFC,");
        }
        setOpenSnackbar(true);
      }

      return result;
    } catch (ex) {
      console.log("Oo0ps!", ex);

      NfcManager.cancelTechnologyRequest();
      setIsScanned(false);
      setError(true);
      return result;
    }
  };

  const cerrar = () => {
    //NfcManager.cancelTechnologyRequest();
    setMostrarEscrituraNFC(false);
  };

  return (
    <>
      <View style={styles.wrapper}>
        <BottomSheet
          isVisible={mostrarEscrituraNFC}
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
              Por favor Acerque el Teléfono a la Tarjeta NFC
            </Text>
            {error && (
              <Text h4 h4Style={{ fontSize: 16 }} style={{ color: "red" }}>
                Ha Ocurrido un error
              </Text>
            )}
          </View>
          <Button mode="contained" color="blue" onPress={() => cerrar()}>
            Cancelar
          </Button>
        </BottomSheet>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
