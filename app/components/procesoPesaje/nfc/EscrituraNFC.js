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

  useEffect(() => {
    writeNdef();
    () => NfcManager.cancelTechnologyRequest();
  }, [isScanned]);

  const writeNdef = async () => {
    let result = false;

    try {
      // STEP 1
      const supported = await NfcManager.isSupported();
      const nfcScanning = await NfcManager.isEnabled();
      if (supported && nfcScanning) {
        await NfcManager.start();
        await NfcManager.requestTechnology(NfcTech.Ndef);

        const bytes = Ndef.encodeMessage([
          Ndef.textRecord(selectedTemporero.name),
          Ndef.textRecord(selectedTemporero.run),
        ]);

        if (bytes) {
          const e = await NfcManager.ndefHandler.writeNdefMessage(bytes);
          console.log("resultado", e);
          result = true;
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

      setMessage("Ha ocurrido un error al escribir " + ex);
      setOpenSnackbar(true);
      setMostrarEscrituraNFC(false);
      NfcManager.cancelTechnologyRequest();
      setIsScanned(false);

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
