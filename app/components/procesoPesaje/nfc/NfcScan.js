import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";
import { Buffer } from "buffer";
// Pre-step, call this before any NFC operations
NfcManager.start();

export default function NfcScan() {
  async function readNdef() {
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      const decodeText = Ndef.text.decodePayload(tag.ndefMessage[1].payload);
      console.log("asdasdasd", decodeText);

      console.warn("Tag found", tag.ndefMessage);
    } catch (ex) {
      console.warn("Oops!", ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={readNdef}>
        <Text>Scan a Tag</Text>
      </TouchableOpacity>
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
