import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Dimensions, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import Autocomplete from "react-native-autocomplete-input";
import { Input, Icon, Button } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FormikProvider, useFormik } from "formik";
import { Picker } from "@react-native-picker/picker";
import RNBluetoothClassic from "react-native-bluetooth-classic";
import { request, PERMISSIONS } from "react-native-permissions";

export default function ConexionBalanza(props) {
  const { permiso } = props;
  const componentMounted = useRef(true);
  const [devices, setDevices] = useState([]);
  const [pairedDevices, setPairedDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      id: "",
    },
  });
  const { values, setValues } = formik;

  const getDeviceName = () => {
    console.log(permiso, "permiso");
    if (permiso) {
      request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT).then(async (result) => {
        if (result === "granted") {
          Promise.resolve(RNBluetoothClassic.getBondedDevices()).then(
            (paired) => {
              setPairedDevices(paired);
              if (paired.length > 0) {
                setSelectedDevice(paired[0].id);
                values.name = paired[0].name;
                values.id = paired[0].id;
              } else {
                values.name = "";
                values.id = "";
              }
            }
          );
        }
      });
    } else {
      values.name = "";
      values.id = "";
    }
  };

  useEffect(() => {
    getDeviceName();
  }, []);

  const handleValueChange = (itemValue) => {
    setSelectedDevice(itemValue);
    if (itemValue !== "") {
      const device = pairedDevices.find((device) => device.id === itemValue);
      values.name = device.name;
      values.id = device.id;
    } else {
      values.name = "";
      values.id = "";
    }
  };

  return (
    <FormikProvider value={formik}>
      <View style={styles.viewPicker}>
        <Picker
          selectedValue={selectedDevice}
          onValueChange={(itemValue, itemIndex) => handleValueChange(itemValue)}
          placeholder="Seleccione un Dispositivo Bluetooth"
          mode="dropdown"
          style={styles.pickerContainer}
        >
          {pairedDevices.map((device) => (
            <Picker.Item
              key={device.id}
              label={device.name}
              value={device.id}
            />
          ))}
        </Picker>
      </View>
    </FormikProvider>
  );
}

const styles = StyleSheet.create({
  autoComplete: {
    paddingHorizontal: 10,
    height: 50,
    fontSize: 16,
  },
  autoCompleteContainer: {
    alignSelf: "center",
    borderRadius: 7,
    marginTop: 15,
    marginBottom: 25,
    width: Dimensions.get("window").width * 0.85,
  },
  autoCompleteInput: {
    borderRadius: 7,
    borderWidth: 1,
    backgroundColor: "white",
  },
  pickerContainer: {
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.85,
    backgroundColor: "white",
  },
  viewPicker: {
    paddingVertical: 2,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 7,
    marginTop: 10,
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.86,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  containerTextFields: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  container: {
    left: 0,
    marginTop: 15,
    alignSelf: "center",
    maxWidth: Dimensions.get("window").width * 0.45,
    borderColor: "gray",
  },

  inputContainer: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "lightgrey",
    backgroundColor: "white",
    height: 50,
  },
  input: {
    height: 49,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  textInput: {
    width: Dimensions.get("window").width * 0.37,
    backgroundColor: "white",
    height: 50,
    margin: 10,
  },
});
