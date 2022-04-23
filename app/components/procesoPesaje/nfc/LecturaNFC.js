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

export default function LecturaNFC(props) {
  const { mostrarLecturaNFC, setMostrarLecturaNFC, formik } = props;
  const componentMounted = useRef(true);
  const [isScanned, setIsScanned] = useState(false);

  const { values } = formik;
  console.log(values);

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
          values.name = Ndef.text.decodePayload(tag.ndefMessage[1].payload);
          values.run = Ndef.text.decodePayload(tag.ndefMessage[1].payload);
        }
        NfcManager.cancelTechnologyRequest();
        setIsScanned(true);
        setTimeout(() => {
          setMostrarLecturaNFC(false);
        }, 500);
      }
    } catch (ex) {
      NfcManager.cancelTechnologyRequest();
      setIsScanned(false);
      console.log("Oops!", ex);
    }
  };

  const cerrar = () => {
    //NfcManager.cancelTechnologyRequest();
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
            Por favor Acerque el Teléfono a la Tarjeta NFC
          </Text>
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
